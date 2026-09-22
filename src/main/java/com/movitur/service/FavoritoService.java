package com.movitur.service;

import com.movitur.dto.FavoritoIdsResponse;
import com.movitur.dto.FavoritoRequest;
import com.movitur.dto.FavoritoResponse;
import com.movitur.entity.Destino;
import com.movitur.entity.Favorito;
import com.movitur.entity.GuiaTuristico;
import com.movitur.entity.Role;
import com.movitur.entity.TipoFavorito;
import com.movitur.entity.Usuario;
import com.movitur.exception.RegraNegocioException;
import com.movitur.exception.ResourceNotFoundException;
import com.movitur.repository.FavoritoRepository;
import com.movitur.repository.UsuarioRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;
    private final UsuarioRepository usuarioRepository;
    private final DestinoService destinoService;
    private final GuiaTuristicoService guiaService;

    public FavoritoService(
            FavoritoRepository favoritoRepository,
            UsuarioRepository usuarioRepository,
            DestinoService destinoService,
            GuiaTuristicoService guiaService) {
        this.favoritoRepository = favoritoRepository;
        this.usuarioRepository = usuarioRepository;
        this.destinoService = destinoService;
        this.guiaService = guiaService;
    }

    public FavoritoResponse adicionar(FavoritoRequest request) {
        Usuario cliente = getClienteAtual();
        validarItem(request.getTipo(), request.getItemId());

        if (favoritoRepository.existsByUsuarioIdAndTipoAndItemId(
                cliente.getId(), request.getTipo(), request.getItemId())) {
            throw new RegraNegocioException("Este item ja esta nos favoritos.");
        }

        Favorito favorito = new Favorito();
        favorito.setUsuario(cliente);
        favorito.setTipo(request.getTipo());
        favorito.setItemId(request.getItemId());
        favoritoRepository.save(favorito);
        return toResponse(favorito);
    }

    public void remover(TipoFavorito tipo, Long itemId) {
        Usuario cliente = getClienteAtual();
        if (!favoritoRepository.existsByUsuarioIdAndTipoAndItemId(cliente.getId(), tipo, itemId)) {
            throw new ResourceNotFoundException("Favorito nao encontrado.");
        }
        favoritoRepository.deleteByUsuarioIdAndTipoAndItemId(cliente.getId(), tipo, itemId);
    }

    public List<FavoritoResponse> listarMinhas() {
        Usuario cliente = getClienteAtual();
        List<FavoritoResponse> resultado = new ArrayList<>();
        for (Favorito favorito : favoritoRepository.findByUsuarioIdOrderByCriadoEmDesc(cliente.getId())) {
            try {
                resultado.add(toResponse(favorito));
            } catch (ResourceNotFoundException ignored) {
                favoritoRepository.delete(favorito);
            }
        }
        return resultado;
    }

    public FavoritoIdsResponse listarIds() {
        Usuario cliente = getClienteAtual();
        List<Long> destinoIds = new ArrayList<>();
        List<Long> guiaIds = new ArrayList<>();
        for (Favorito favorito : favoritoRepository.findByUsuarioIdOrderByCriadoEmDesc(cliente.getId())) {
            if (favorito.getTipo() == TipoFavorito.DESTINO) {
                destinoIds.add(favorito.getItemId());
            } else {
                guiaIds.add(favorito.getItemId());
            }
        }
        return new FavoritoIdsResponse(destinoIds, guiaIds);
    }

    public boolean isFavorito(TipoFavorito tipo, Long itemId) {
        Usuario cliente = getClienteAtual();
        return favoritoRepository.existsByUsuarioIdAndTipoAndItemId(cliente.getId(), tipo, itemId);
    }

    private FavoritoResponse toResponse(Favorito favorito) {
        if (favorito.getTipo() == TipoFavorito.DESTINO) {
            Destino destino = destinoService.buscarEntidade(favorito.getItemId());
            return FavoritoResponse.of(
                    favorito,
                    destino.getNome(),
                    destino.getCidade() + ", " + destino.getProvincia(),
                    destino.getImagemUrl());
        }
        GuiaTuristico guia = guiaService.buscarEntidade(favorito.getItemId());
        return FavoritoResponse.of(
                favorito,
                guia.getNome(),
                guia.getAnosExperiencia() + " anos · " + String.format("%.1f", guia.getAvaliacaoMedia()) + " ★",
                guia.getFotoUrl());
    }

    private void validarItem(TipoFavorito tipo, Long itemId) {
        if (tipo == TipoFavorito.DESTINO) {
            Destino destino = destinoService.buscarEntidade(itemId);
            if (!destino.isAtivo()) {
                throw new RegraNegocioException("Destino nao disponivel.");
            }
        } else {
            GuiaTuristico guia = guiaService.buscarEntidade(itemId);
            if (!guia.isAtivo()) {
                throw new RegraNegocioException("Guia nao disponivel.");
            }
        }
    }

    private Usuario getClienteAtual() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new RegraNegocioException("Utilizador nao autenticado.");
        }
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Utilizador nao encontrado."));
        if (usuario.getRole() != Role.CLIENTE) {
            throw new RegraNegocioException("Apenas clientes podem gerir favoritos.");
        }
        return usuario;
    }
}
