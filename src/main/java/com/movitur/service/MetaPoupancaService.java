package com.movitur.service;

import com.movitur.dto.DepositoPoupancaRequest;
import com.movitur.dto.DepositoPoupancaResponse;
import com.movitur.dto.MetaPoupancaRequest;
import com.movitur.dto.MetaPoupancaResponse;
import com.movitur.entity.DepositoPoupanca;
import com.movitur.entity.Destino;
import com.movitur.entity.MetaPoupanca;
import com.movitur.entity.MetodoPagamento;
import com.movitur.entity.Role;
import com.movitur.entity.Usuario;
import com.movitur.exception.RegraNegocioException;
import com.movitur.exception.ResourceNotFoundException;
import com.movitur.repository.DepositoPoupancaRepository;
import com.movitur.repository.MetaPoupancaRepository;
import com.movitur.repository.PagamentoRepository;
import com.movitur.repository.UsuarioRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class MetaPoupancaService {

    private final MetaPoupancaRepository metaRepository;
    private final DepositoPoupancaRepository depositoRepository;
    private final PagamentoRepository pagamentoRepository;
    private final DestinoService destinoService;
    private final UsuarioRepository usuarioRepository;

    public MetaPoupancaService(
            MetaPoupancaRepository metaRepository,
            DepositoPoupancaRepository depositoRepository,
            PagamentoRepository pagamentoRepository,
            DestinoService destinoService,
            UsuarioRepository usuarioRepository) {
        this.metaRepository = metaRepository;
        this.depositoRepository = depositoRepository;
        this.pagamentoRepository = pagamentoRepository;
        this.destinoService = destinoService;
        this.usuarioRepository = usuarioRepository;
    }

    public MetaPoupancaResponse criar(MetaPoupancaRequest request) {
        Usuario cliente = getClienteAtual();
        MetaPoupanca meta = new MetaPoupanca();
        meta.setUsuario(cliente);
        meta.setTitulo(request.getTitulo());
        meta.setValorMeta(request.getValorMeta());
        meta.setDataLimite(request.getDataLimite());
        if (request.getDestinoId() != null) {
            Destino destino = destinoService.buscarEntidade(request.getDestinoId());
            meta.setDestino(destino);
        }
        return toResponse(metaRepository.save(meta));
    }

    @Transactional(readOnly = true)
    public List<MetaPoupancaResponse> listarMinhas() {
        return metaRepository.findByUsuarioIdOrderByCriadoEmDesc(getClienteAtual().getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public MetaPoupancaResponse buscarMinha(Long id) {
        return toResponse(buscarMetaDoCliente(id));
    }

    public DepositoPoupancaResponse depositar(Long metaId, DepositoPoupancaRequest request) {
        MetaPoupanca meta = buscarMetaDoCliente(metaId);
        if (!meta.isAtiva()) {
            throw new RegraNegocioException("Esta meta de poupanca esta encerrada.");
        }
        DepositoPoupanca deposito = new DepositoPoupanca();
        deposito.setMeta(meta);
        deposito.setValor(request.getValor());
        deposito.setDescricao(request.getDescricao());
        return DepositoPoupancaResponse.fromEntity(depositoRepository.save(deposito));
    }

    @Transactional(readOnly = true)
    public List<DepositoPoupancaResponse> listarDepositos(Long metaId) {
        MetaPoupanca meta = buscarMetaDoCliente(metaId);
        return depositoRepository.findByMetaIdOrderByCriadoEmDesc(meta.getId())
                .stream()
                .map(DepositoPoupancaResponse::fromEntity)
                .toList();
    }

    public void encerrar(Long metaId) {
        MetaPoupanca meta = buscarMetaDoCliente(metaId);
        meta.setAtiva(false);
        metaRepository.save(meta);
    }

    public double calcularSaldo(MetaPoupanca meta) {
        double depositos = depositoRepository.somarDepositosPorMeta(meta.getId());
        double usado = pagamentoRepository.somarPagamentosPoupancaPorMeta(meta.getId(), MetodoPagamento.POUPANCA);
        return depositos - usado;
    }

    MetaPoupanca buscarMetaDoCliente(Long id) {
        return metaRepository.findByIdAndUsuarioId(id, getClienteAtual().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Meta de poupanca nao encontrada."));
    }

    private MetaPoupancaResponse toResponse(MetaPoupanca meta) {
        return MetaPoupancaResponse.fromEntity(meta, calcularSaldo(meta));
    }

    private Usuario getClienteAtual() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new RegraNegocioException("Utilizador nao autenticado.");
        }
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Utilizador nao encontrado."));
        if (usuario.getRole() != Role.CLIENTE) {
            throw new RegraNegocioException("Apenas clientes podem gerir poupancas.");
        }
        return usuario;
    }
}
