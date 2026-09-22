package com.movitur.service;

import com.movitur.dto.FeedbackRequest;
import com.movitur.dto.FeedbackResponse;
import com.movitur.dto.FeedbackResumoResponse;
import com.movitur.entity.Destino;
import com.movitur.entity.Estabelecimento;
import com.movitur.entity.Feedback;
import com.movitur.entity.GuiaTuristico;
import com.movitur.entity.Role;
import com.movitur.entity.TipoEstabelecimento;
import com.movitur.entity.TipoFeedbackAlvo;
import com.movitur.entity.Usuario;
import com.movitur.exception.RegraNegocioException;
import com.movitur.repository.EstabelecimentoRepository;
import com.movitur.repository.FeedbackRepository;
import com.movitur.repository.GuiaTuristicoRepository;
import com.movitur.repository.UsuarioRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final DestinoService destinoService;
    private final GuiaTuristicoService guiaTuristicoService;
    private final EstabelecimentoService estabelecimentoService;
    private final GuiaTuristicoRepository guiaRepository;
    private final EstabelecimentoRepository estabelecimentoRepository;
    private final UsuarioRepository usuarioRepository;

    public FeedbackService(
            FeedbackRepository feedbackRepository,
            DestinoService destinoService,
            GuiaTuristicoService guiaTuristicoService,
            EstabelecimentoService estabelecimentoService,
            GuiaTuristicoRepository guiaRepository,
            EstabelecimentoRepository estabelecimentoRepository,
            UsuarioRepository usuarioRepository) {
        this.feedbackRepository = feedbackRepository;
        this.destinoService = destinoService;
        this.guiaTuristicoService = guiaTuristicoService;
        this.estabelecimentoService = estabelecimentoService;
        this.guiaRepository = guiaRepository;
        this.estabelecimentoRepository = estabelecimentoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public FeedbackResponse criar(FeedbackRequest request) {
        Usuario cliente = getClienteAtual();
        String entidadeNome = validarEntidade(request.getTipoAlvo(), request.getEntidadeId());

        Feedback feedback = new Feedback();
        feedback.setUsuario(cliente);
        feedback.setTipoAlvo(request.getTipoAlvo());
        feedback.setEntidadeId(request.getEntidadeId());
        feedback.setEntidadeNome(entidadeNome);
        feedback.setEstrelas(request.getEstrelas());
        feedback.setComentario(request.getComentario().trim());

        Feedback guardado = feedbackRepository.save(feedback);
        atualizarMediaEntidade(request.getTipoAlvo(), request.getEntidadeId());

        return FeedbackResponse.fromEntity(guardado);
    }

    @Transactional(readOnly = true)
    public List<FeedbackResponse> listarPorEntidade(TipoFeedbackAlvo tipoAlvo, Long entidadeId) {
        validarEntidade(tipoAlvo, entidadeId);
        return feedbackRepository.findByTipoAlvoAndEntidadeIdOrderByCriadoEmDesc(tipoAlvo, entidadeId)
                .stream()
                .filter(f -> f.getEntidadeId() != null && f.getEntidadeId() > 0)
                .map(FeedbackResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public FeedbackResumoResponse resumoPorEntidade(TipoFeedbackAlvo tipoAlvo, Long entidadeId) {
        validarEntidade(tipoAlvo, entidadeId);
        return construirResumo(tipoAlvo, entidadeId);
    }

    @Transactional(readOnly = true)
    public List<FeedbackResponse> listarRecentes() {
        return feedbackRepository.findTop20ByOrderByCriadoEmDesc()
                .stream()
                .filter(f -> f.getEntidadeId() != null && f.getEntidadeId() > 0 && f.getEntidadeNome() != null && !f.getEntidadeNome().isBlank())
                .limit(10)
                .map(FeedbackResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<FeedbackResponse> listarTodosAdmin() {
        return feedbackRepository.findAllByOrderByCriadoEmDesc()
                .stream()
                .map(FeedbackResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public FeedbackResumoResponse resumo() {
        long total = feedbackRepository.count();
        Double media = feedbackRepository.calcularMediaGlobal();
        double mediaArredondada = arredondar(media);
        return new FeedbackResumoResponse(total, mediaArredondada);
    }

    private String validarEntidade(TipoFeedbackAlvo tipoAlvo, Long entidadeId) {
        return switch (tipoAlvo) {
            case DESTINO -> {
                Destino destino = destinoService.buscarEntidade(entidadeId);
                yield destino.getNome();
            }
            case GUIA -> {
                GuiaTuristico guia = guiaTuristicoService.buscarEntidade(entidadeId);
                yield guia.getNome();
            }
            case HOTEL, RESTAURANTE -> {
                Estabelecimento estabelecimento = estabelecimentoService.buscarEntidade(entidadeId);
                TipoEstabelecimento esperado = tipoAlvo == TipoFeedbackAlvo.HOTEL
                        ? TipoEstabelecimento.HOTEL
                        : TipoEstabelecimento.RESTAURANTE;
                if (estabelecimento.getTipo() != esperado) {
                    throw new RegraNegocioException("Tipo de estabelecimento invalido para este feedback.");
                }
                yield estabelecimento.getNome();
            }
        };
    }

    private void atualizarMediaEntidade(TipoFeedbackAlvo tipoAlvo, Long entidadeId) {
        Double media = feedbackRepository.calcularMediaPorEntidade(tipoAlvo, entidadeId);
        double mediaArredondada = arredondar(media);

        switch (tipoAlvo) {
            case GUIA -> {
                GuiaTuristico guia = guiaTuristicoService.buscarEntidade(entidadeId);
                guia.setAvaliacaoMedia(mediaArredondada);
                guiaRepository.save(guia);
            }
            case HOTEL, RESTAURANTE -> {
                Estabelecimento estabelecimento = estabelecimentoService.buscarEntidade(entidadeId);
                estabelecimento.setAvaliacaoMedia(mediaArredondada);
                estabelecimentoRepository.save(estabelecimento);
            }
            default -> {
                // Destinos nao guardam media na entidade
            }
        }
    }

    private FeedbackResumoResponse construirResumo(TipoFeedbackAlvo tipoAlvo, Long entidadeId) {
        long total = feedbackRepository.countByTipoAlvoAndEntidadeId(tipoAlvo, entidadeId);
        Double media = feedbackRepository.calcularMediaPorEntidade(tipoAlvo, entidadeId);
        return new FeedbackResumoResponse(total, arredondar(media));
    }

    private double arredondar(Double media) {
        return Math.round((media != null ? media : 0) * 10.0) / 10.0;
    }

    private Usuario getClienteAtual() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new RegraNegocioException("Utilizador nao autenticado.");
        }
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(auth.getName())
                .orElseThrow(() -> new RegraNegocioException("Utilizador nao encontrado."));
        if (usuario.getRole() != Role.CLIENTE) {
            throw new RegraNegocioException("Apenas clientes podem enviar feedback.");
        }
        return usuario;
    }
}
