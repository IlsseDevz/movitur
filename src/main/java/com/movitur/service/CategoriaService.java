package com.movitur.service;

import com.movitur.dto.CategoriaRequest;
import com.movitur.dto.CategoriaResponse;
import com.movitur.entity.Categoria;
import com.movitur.entity.TipoExperiencia;
import com.movitur.exception.ResourceNotFoundException;
import com.movitur.repository.CategoriaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    public CategoriaResponse criar(CategoriaRequest request) {
        if (categoriaRepository.existsByNomeIgnoreCase(request.getNome())) {
            throw new IllegalArgumentException("Ja existe uma categoria com este nome");
        }

        Categoria categoria = new Categoria();
        aplicarDados(categoria, request);
        return toResponse(categoriaRepository.save(categoria));
    }

    @Transactional(readOnly = true)
    public List<CategoriaResponse> listar(Boolean apenasAtivos, TipoExperiencia tipoExperiencia) {
        List<Categoria> categorias;

        if (tipoExperiencia != null) {
            categorias = categoriaRepository.findByTipoExperiencia(tipoExperiencia);
        } else if (Boolean.TRUE.equals(apenasAtivos)) {
            categorias = categoriaRepository.findByAtivoTrue();
        } else {
            categorias = categoriaRepository.findAll();
        }

        return categorias.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public CategoriaResponse buscarPorId(Long id) {
        return toResponse(buscarEntidade(id));
    }

    public CategoriaResponse atualizar(Long id, CategoriaRequest request) {
        Categoria categoria = buscarEntidade(id);

        if (!categoria.getNome().equalsIgnoreCase(request.getNome())
                && categoriaRepository.existsByNomeIgnoreCase(request.getNome())) {
            throw new IllegalArgumentException("Ja existe uma categoria com este nome");
        }

        aplicarDados(categoria, request);
        return toResponse(categoriaRepository.save(categoria));
    }

    public void remover(Long id) {
        Categoria categoria = buscarEntidade(id);
        categoriaRepository.delete(categoria);
    }

    public Categoria buscarEntidade(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria nao encontrada com id: " + id));
    }

    private void aplicarDados(Categoria categoria, CategoriaRequest request) {
        categoria.setNome(request.getNome());
        categoria.setDescricao(request.getDescricao());
        categoria.setTipoExperiencia(request.getTipoExperiencia());
        categoria.setAtivo(request.isAtivo());
    }

    private CategoriaResponse toResponse(Categoria categoria) {
        CategoriaResponse response = new CategoriaResponse();
        response.setId(categoria.getId());
        response.setNome(categoria.getNome());
        response.setDescricao(categoria.getDescricao());
        response.setTipoExperiencia(categoria.getTipoExperiencia());
        response.setAtivo(categoria.isAtivo());
        return response;
    }
}
