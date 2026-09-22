package com.movitur.service;

import com.movitur.dto.GuiaTuristicoRequest;
import com.movitur.dto.GuiaTuristicoResponse;
import com.movitur.entity.Destino;
import com.movitur.entity.GuiaTuristico;
import com.movitur.exception.ResourceNotFoundException;
import com.movitur.repository.GuiaTuristicoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class GuiaTuristicoService {

    private final GuiaTuristicoRepository guiaTuristicoRepository;
    private final DestinoService destinoService;

    public GuiaTuristicoService(GuiaTuristicoRepository guiaTuristicoRepository, DestinoService destinoService) {
        this.guiaTuristicoRepository = guiaTuristicoRepository;
        this.destinoService = destinoService;
    }

    public GuiaTuristicoResponse criar(GuiaTuristicoRequest request) {
        GuiaTuristico guia = new GuiaTuristico();
        aplicarDados(guia, request, true);
        return toResponse(guiaTuristicoRepository.save(guia));
    }

    @Transactional(readOnly = true)
    public List<GuiaTuristicoResponse> listar(Boolean apenasAtivos, Long destinoId) {
        List<GuiaTuristico> guias;

        if (destinoId != null) {
            guias = guiaTuristicoRepository.findByDestinoId(destinoId);
        } else if (Boolean.TRUE.equals(apenasAtivos)) {
            guias = guiaTuristicoRepository.findByAtivoTrue();
        } else {
            guias = guiaTuristicoRepository.findAll();
        }

        return guias.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public GuiaTuristicoResponse buscarPorId(Long id) {
        return toResponse(buscarEntidade(id));
    }

    public GuiaTuristicoResponse atualizar(Long id, GuiaTuristicoRequest request) {
        GuiaTuristico guia = buscarEntidade(id);
        aplicarDados(guia, request, false);
        return toResponse(guiaTuristicoRepository.save(guia));
    }

    public void remover(Long id) {
        GuiaTuristico guia = buscarEntidade(id);
        guiaTuristicoRepository.delete(guia);
    }

    public GuiaTuristico buscarEntidade(Long id) {
        return guiaTuristicoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Guia turistico nao encontrado com id: " + id));
    }

    private void aplicarDados(GuiaTuristico guia, GuiaTuristicoRequest request, boolean novo) {
        guia.setNome(request.getNome());
        if (novo) {
            guia.setEmail(gerarEmailInterno());
            guia.setTelefone("-");
        }
        guia.setBiografia(request.getBiografia());
        guia.setAnosExperiencia(request.getAnosExperiencia());
        guia.setFotoUrl(request.getFotoUrl());
        guia.setAtivo(request.isAtivo());
        guia.setDestinos(resolverDestinos(request.getDestinoIds()));
    }

    private Set<Destino> resolverDestinos(Set<Long> destinoIds) {
        if (destinoIds == null || destinoIds.isEmpty()) {
            return new HashSet<>();
        }

        List<Destino> destinos = destinoService.buscarEntidadesPorIds(destinoIds);
        if (destinos.size() != destinoIds.size()) {
            throw new IllegalArgumentException("Um ou mais destinos informados nao existem");
        }

        return new HashSet<>(destinos);
    }

    private GuiaTuristicoResponse toResponse(GuiaTuristico guia) {
        GuiaTuristicoResponse response = new GuiaTuristicoResponse();
        response.setId(guia.getId());
        response.setNome(guia.getNome());
        response.setBiografia(guia.getBiografia());
        response.setAnosExperiencia(guia.getAnosExperiencia());
        response.setFotoUrl(guia.getFotoUrl());
        response.setAvaliacaoMedia(guia.getAvaliacaoMedia());
        response.setAtivo(guia.isAtivo());
        response.setDestinoIds(guia.getDestinos().stream()
                .map(Destino::getId)
                .collect(Collectors.toSet()));
        return response;
    }

    private String gerarEmailInterno() {
        return "guia-" + UUID.randomUUID().toString().substring(0, 8) + "@interno.movitur";
    }
}
