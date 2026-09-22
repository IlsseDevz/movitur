package com.movitur.service;

import com.movitur.dto.AvaliacaoRequest;
import com.movitur.dto.AvaliacaoResponse;
import com.movitur.entity.Avaliacao;
import com.movitur.entity.GuiaTuristico;
import com.movitur.entity.Reserva;
import com.movitur.entity.Role;
import com.movitur.entity.StatusReserva;
import com.movitur.entity.Usuario;
import com.movitur.exception.RegraNegocioException;
import com.movitur.repository.AvaliacaoRepository;
import com.movitur.repository.GuiaTuristicoRepository;
import com.movitur.repository.ReservaRepository;
import com.movitur.repository.UsuarioRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class AvaliacaoService {

    private final AvaliacaoRepository avaliacaoRepository;
    private final ReservaRepository reservaRepository;
    private final GuiaTuristicoRepository guiaRepository;
    private final UsuarioRepository usuarioRepository;

    public AvaliacaoService(
            AvaliacaoRepository avaliacaoRepository,
            ReservaRepository reservaRepository,
            GuiaTuristicoRepository guiaRepository,
            UsuarioRepository usuarioRepository) {
        this.avaliacaoRepository = avaliacaoRepository;
        this.reservaRepository = reservaRepository;
        this.guiaRepository = guiaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public AvaliacaoResponse criar(AvaliacaoRequest request) {
        Usuario cliente = getClienteAtual();
        Reserva reserva = reservaRepository.findByIdAndUsuarioId(request.getReservaId(), cliente.getId())
                .orElseThrow(() -> new RegraNegocioException("Reserva nao encontrada."));

        if (reserva.getStatus() != StatusReserva.CONFIRMADA) {
            throw new RegraNegocioException("Apenas reservas confirmadas podem ser avaliadas.");
        }
        if (reserva.getGuia() == null) {
            throw new RegraNegocioException("Esta reserva nao tem guia associado para avaliar.");
        }
        if (avaliacaoRepository.existsByReservaId(reserva.getId())) {
            throw new RegraNegocioException("Esta reserva ja foi avaliada.");
        }

        LocalDate fimViagem = reserva.getDataInicio().plusDays(reserva.getNumeroDias() - 1L);
        if (LocalDate.now().isBefore(fimViagem)) {
            throw new RegraNegocioException("So pode avaliar apos o termino da viagem.");
        }

        Avaliacao avaliacao = new Avaliacao();
        avaliacao.setUsuario(cliente);
        avaliacao.setGuia(reserva.getGuia());
        avaliacao.setReserva(reserva);
        avaliacao.setNota(request.getNota());
        avaliacao.setComentario(request.getComentario());

        Avaliacao guardada = avaliacaoRepository.save(avaliacao);
        atualizarMediaGuia(reserva.getGuia().getId());

        return AvaliacaoResponse.fromEntity(guardada);
    }

    @Transactional(readOnly = true)
    public List<AvaliacaoResponse> listarPorGuia(Long guiaId) {
        if (!guiaRepository.existsById(guiaId)) {
            throw new RegraNegocioException("Guia nao encontrado.");
        }
        return avaliacaoRepository.findByGuiaIdOrderByCriadoEmDesc(guiaId)
                .stream()
                .map(AvaliacaoResponse::fromEntity)
                .toList();
    }

    private void atualizarMediaGuia(Long guiaId) {
        GuiaTuristico guia = guiaRepository.findById(guiaId)
                .orElseThrow(() -> new RegraNegocioException("Guia nao encontrado."));
        Double media = avaliacaoRepository.calcularMediaPorGuia(guiaId);
        guia.setAvaliacaoMedia(Math.round(media * 10.0) / 10.0);
        guiaRepository.save(guia);
    }

    private Usuario getClienteAtual() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new RegraNegocioException("Utilizador nao autenticado.");
        }
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(auth.getName())
                .orElseThrow(() -> new RegraNegocioException("Utilizador nao encontrado."));
        if (usuario.getRole() != Role.CLIENTE) {
            throw new RegraNegocioException("Apenas clientes podem avaliar guias.");
        }
        return usuario;
    }
}
