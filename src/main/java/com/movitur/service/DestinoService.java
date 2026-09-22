package com.movitur.service;

import com.movitur.dto.DestinoOrdenacao;
import com.movitur.dto.DestinoRequest;
import com.movitur.dto.DestinoResponse;
import com.movitur.entity.Categoria;
import com.movitur.entity.Destino;
import com.movitur.entity.TipoFeedbackAlvo;
import com.movitur.exception.ResourceNotFoundException;
import com.movitur.repository.DestinoRepository;
import com.movitur.repository.FeedbackRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class DestinoService {

    private final DestinoRepository destinoRepository;
    private final CategoriaService categoriaService;
    private final FeedbackRepository feedbackRepository;

    public DestinoService(
            DestinoRepository destinoRepository,
            CategoriaService categoriaService,
            FeedbackRepository feedbackRepository) {
        this.destinoRepository = destinoRepository;
        this.categoriaService = categoriaService;
        this.feedbackRepository = feedbackRepository;
    }

    public DestinoResponse criar(DestinoRequest request) {
        Categoria categoria = categoriaService.buscarEntidade(request.getCategoriaId());

        Destino destino = new Destino();
        aplicarDados(destino, request, categoria);
        return toResponse(destinoRepository.save(destino));
    }

    @Transactional(readOnly = true)
    public List<DestinoResponse> listar(
            Boolean apenasAtivos,
            Long categoriaId,
            String provincia,
            String q,
            BigDecimal precoMin,
            BigDecimal precoMax,
            DestinoOrdenacao ordenacao) {
        Specification<Destino> spec = comFiltros(apenasAtivos, categoriaId, provincia, q, precoMin, precoMax);
        Sort sort = toSort(ordenacao);
        return destinoRepository.findAll(spec, sort).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public DestinoResponse buscarPorId(Long id) {
        return toResponse(buscarEntidade(id));
    }

    public DestinoResponse atualizar(Long id, DestinoRequest request) {
        Destino destino = buscarEntidade(id);
        Categoria categoria = categoriaService.buscarEntidade(request.getCategoriaId());

        aplicarDados(destino, request, categoria);
        return toResponse(destinoRepository.save(destino));
    }

    public void remover(Long id) {
        Destino destino = buscarEntidade(id);
        destinoRepository.delete(destino);
    }

    public Destino buscarEntidade(Long id) {
        return destinoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destino nao encontrado com id: " + id));
    }

    public List<Destino> buscarEntidadesPorIds(Iterable<Long> ids) {
        return destinoRepository.findAllById(ids);
    }

    private Specification<Destino> comFiltros(
            Boolean apenasAtivos,
            Long categoriaId,
            String provincia,
            String q,
            BigDecimal precoMin,
            BigDecimal precoMax) {
        return (root, query, cb) -> {
            List<Predicate> preds = new ArrayList<>();

            if (Boolean.TRUE.equals(apenasAtivos)) {
                preds.add(cb.isTrue(root.get("ativo")));
            }
            if (categoriaId != null) {
                preds.add(cb.equal(root.get("categoria").get("id"), categoriaId));
            }
            if (provincia != null && !provincia.isBlank()) {
                preds.add(cb.equal(cb.lower(root.get("provincia")), provincia.trim().toLowerCase()));
            }
            if (q != null && !q.isBlank()) {
                String pattern = "%" + q.trim().toLowerCase() + "%";
                preds.add(cb.or(
                        cb.like(cb.lower(root.get("nome")), pattern),
                        cb.like(cb.lower(root.get("descricao")), pattern),
                        cb.like(cb.lower(root.get("cidade")), pattern),
                        cb.like(cb.lower(root.get("provincia")), pattern)));
            }
            if (precoMin != null) {
                preds.add(cb.greaterThanOrEqualTo(root.get("precoMedioEstimado"), precoMin));
            }
            if (precoMax != null) {
                preds.add(cb.lessThanOrEqualTo(root.get("precoMedioEstimado"), precoMax));
            }

            return cb.and(preds.toArray(new Predicate[0]));
        };
    }

    private Sort toSort(DestinoOrdenacao ordenacao) {
        if (ordenacao == null) {
            return Sort.by(Sort.Direction.ASC, "nome");
        }
        return switch (ordenacao) {
            case NOME_DESC -> Sort.by(Sort.Direction.DESC, "nome");
            case PRECO_ASC -> Sort.by(Sort.Direction.ASC, "precoMedioEstimado");
            case PRECO_DESC -> Sort.by(Sort.Direction.DESC, "precoMedioEstimado");
            default -> Sort.by(Sort.Direction.ASC, "nome");
        };
    }

    private void aplicarDados(Destino destino, DestinoRequest request, Categoria categoria) {
        destino.setNome(request.getNome());
        destino.setDescricao(request.getDescricao());
        destino.setProvincia(request.getProvincia());
        destino.setCidade(request.getCidade());
        destino.setImagemUrl(request.getImagemUrl());
        destino.setPrecoMedioEstimado(request.getPrecoMedioEstimado());
        destino.setLatitude(request.getLatitude());
        destino.setLongitude(request.getLongitude());
        destino.setAtivo(request.isAtivo());
        destino.setCategoria(categoria);
    }

    private DestinoResponse toResponse(Destino destino) {
        DestinoResponse response = new DestinoResponse();
        response.setId(destino.getId());
        response.setNome(destino.getNome());
        response.setDescricao(destino.getDescricao());
        response.setProvincia(destino.getProvincia());
        response.setCidade(destino.getCidade());
        response.setImagemUrl(destino.getImagemUrl());
        response.setPrecoMedioEstimado(destino.getPrecoMedioEstimado());
        response.setLatitude(destino.getLatitude());
        response.setLongitude(destino.getLongitude());
        response.setAtivo(destino.isAtivo());
        response.setCategoriaId(destino.getCategoria().getId());
        response.setCategoriaNome(destino.getCategoria().getNome());
        long total = feedbackRepository.countByTipoAlvoAndEntidadeId(TipoFeedbackAlvo.DESTINO, destino.getId());
        response.setTotalFeedbacks(total);
        if (total > 0) {
            Double media = feedbackRepository.calcularMediaPorEntidade(TipoFeedbackAlvo.DESTINO, destino.getId());
            response.setAvaliacaoMedia(Math.round((media != null ? media : 0) * 10.0) / 10.0);
        } else {
            response.setAvaliacaoMedia(0.0);
        }
        return response;
    }
}
