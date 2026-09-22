package com.movitur.service;

import com.movitur.dto.EstabelecimentoRequest;
import com.movitur.dto.EstabelecimentoResponse;
import com.movitur.entity.Destino;
import com.movitur.entity.Estabelecimento;
import com.movitur.entity.TipoEstabelecimento;
import com.movitur.exception.ResourceNotFoundException;
import com.movitur.repository.EstabelecimentoRepository;
import com.movitur.util.PlanoAnuncioUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EstabelecimentoService {

    private static final int LIMITE_SIMULADOR = 3;

    private final EstabelecimentoRepository estabelecimentoRepository;
    private final DestinoService destinoService;

    public EstabelecimentoService(
            EstabelecimentoRepository estabelecimentoRepository,
            DestinoService destinoService) {
        this.estabelecimentoRepository = estabelecimentoRepository;
        this.destinoService = destinoService;
    }

    public EstabelecimentoResponse criar(EstabelecimentoRequest request) {
        Estabelecimento estabelecimento = new Estabelecimento();
        aplicarDados(estabelecimento, request);
        return toResponse(estabelecimentoRepository.save(estabelecimento));
    }

    @Transactional(readOnly = true)
    public List<EstabelecimentoResponse> listar(
            TipoEstabelecimento tipo,
            Long destinoId,
            String provincia,
            String cidade,
            Boolean ativo) {
        String provinciaFiltro = textoOuNulo(provincia);
        String cidadeFiltro = textoOuNulo(cidade);
        return estabelecimentoRepository.findPublicados(tipo, destinoId, ativo)
                .stream()
                .filter(e -> provinciaFiltro == null
                        || (e.getDestino().getProvincia() != null
                        && e.getDestino().getProvincia().equalsIgnoreCase(provinciaFiltro)))
                .filter(e -> cidadeFiltro == null
                        || (e.getDestino().getCidade() != null
                        && e.getDestino().getCidade().equalsIgnoreCase(cidadeFiltro)))
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public EstabelecimentoResponse buscarPorId(Long id) {
        return toResponse(buscarEntidade(id));
    }

    @Transactional(readOnly = true)
    public List<EstabelecimentoResponse> sugerirHoteis(Long destinoId) {
        return estabelecimentoRepository.findSugeridosSimulador(destinoId, TipoEstabelecimento.HOTEL)
                .stream()
                .limit(LIMITE_SIMULADOR)
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EstabelecimentoResponse> sugerirRestaurantes(Long destinoId) {
        return estabelecimentoRepository.findSugeridosSimulador(destinoId, TipoEstabelecimento.RESTAURANTE)
                .stream()
                .limit(LIMITE_SIMULADOR)
                .map(this::toResponse)
                .toList();
    }

    public EstabelecimentoResponse atualizar(Long id, EstabelecimentoRequest request) {
        Estabelecimento estabelecimento = buscarEntidade(id);
        aplicarDados(estabelecimento, request);
        return toResponse(estabelecimentoRepository.save(estabelecimento));
    }

    public void remover(Long id) {
        estabelecimentoRepository.delete(buscarEntidade(id));
    }

    public Estabelecimento buscarEntidade(Long id) {
        return estabelecimentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Estabelecimento nao encontrado com id: " + id));
    }

    private void aplicarDados(Estabelecimento estabelecimento, EstabelecimentoRequest request) {
        Destino destino = destinoService.buscarEntidade(request.getDestinoId());
        estabelecimento.setNome(request.getNome());
        estabelecimento.setDescricao(request.getDescricao());
        estabelecimento.setTipo(request.getTipo());
        estabelecimento.setImagemUrl(request.getImagemUrl());
        estabelecimento.setEndereco(request.getEndereco());
        if (request.getAvaliacaoMedia() != null) {
            estabelecimento.setAvaliacaoMedia(request.getAvaliacaoMedia());
        }
        estabelecimento.setPrecoMedio(request.getPrecoMedio());
        estabelecimento.setDestino(destino);
        estabelecimento.setPlanoAnuncio(request.getPlanoAnuncio());
        estabelecimento.setStatusPagamento(request.getStatusPagamento());
        estabelecimento.setDataExpiracao(request.getDataExpiracao());
        estabelecimento.setPrioridadeExibicao(PlanoAnuncioUtils.prioridadeDe(request.getPlanoAnuncio()));
        estabelecimento.setAtivo(request.isAtivo());
    }

    private static String textoOuNulo(String valor) {
        if (valor == null || valor.isBlank()) {
            return null;
        }
        return valor.trim();
    }

    private EstabelecimentoResponse toResponse(Estabelecimento estabelecimento) {
        EstabelecimentoResponse response = new EstabelecimentoResponse();
        response.setId(estabelecimento.getId());
        response.setNome(estabelecimento.getNome());
        response.setDescricao(estabelecimento.getDescricao());
        response.setTipo(estabelecimento.getTipo());
        response.setImagemUrl(estabelecimento.getImagemUrl());
        response.setEndereco(estabelecimento.getEndereco());
        response.setAvaliacaoMedia(estabelecimento.getAvaliacaoMedia());
        response.setPrecoMedio(estabelecimento.getPrecoMedio());
        response.setAtivo(estabelecimento.isAtivo());
        response.setDestinoId(estabelecimento.getDestino().getId());
        response.setDestinoNome(estabelecimento.getDestino().getNome());
        response.setDestinoCidade(estabelecimento.getDestino().getCidade());
        response.setDestinoProvincia(estabelecimento.getDestino().getProvincia());
        response.setPlanoAnuncio(estabelecimento.getPlanoAnuncio());
        response.setStatusPagamento(estabelecimento.getStatusPagamento());
        response.setDataExpiracao(estabelecimento.getDataExpiracao());
        response.setPrioridadeExibicao(estabelecimento.getPrioridadeExibicao());
        int prioridadeEfectiva = PlanoAnuncioUtils.prioridadeEfectiva(estabelecimento);
        response.setPrioridadeEfectiva(prioridadeEfectiva);
        response.setPatrocinado(PlanoAnuncioUtils.patrocinado(estabelecimento));
        return response;
    }
}
