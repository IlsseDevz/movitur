package com.movitur.service;

import com.movitur.dto.DestinoSugeridoResponse;
import com.movitur.dto.SimuladorRequest;
import com.movitur.dto.SimuladorResponse;
import com.movitur.entity.Destino;
import com.movitur.entity.SimulacaoViagem;
import com.movitur.entity.TipoExperiencia;
import com.movitur.entity.Usuario;
import com.movitur.exception.RegraNegocioException;
import com.movitur.exception.ResourceNotFoundException;
import com.movitur.repository.DestinoRepository;
import com.movitur.repository.SimulacaoViagemRepository;
import com.movitur.repository.UsuarioRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@Transactional
public class SimuladorViagemService {

    private static final BigDecimal CUSTO_DIARIO_PADRAO = new BigDecimal("3000.00");
    private static final BigDecimal PERCENT_HOSPEDAGEM = new BigDecimal("0.40");
    private static final BigDecimal PERCENT_ALIMENTACAO = new BigDecimal("0.25");
    private static final BigDecimal PERCENT_TRANSPORTE = new BigDecimal("0.20");
    private static final BigDecimal PERCENT_ATIVIDADES = new BigDecimal("0.15");

    private final SimulacaoViagemRepository simulacaoViagemRepository;
    private final DestinoRepository destinoRepository;
    private final DestinoService destinoService;
    private final EstabelecimentoService estabelecimentoService;
    private final UsuarioRepository usuarioRepository;

    public SimuladorViagemService(
            SimulacaoViagemRepository simulacaoViagemRepository,
            DestinoRepository destinoRepository,
            DestinoService destinoService,
            EstabelecimentoService estabelecimentoService,
            UsuarioRepository usuarioRepository) {
        this.simulacaoViagemRepository = simulacaoViagemRepository;
        this.destinoRepository = destinoRepository;
        this.destinoService = destinoService;
        this.estabelecimentoService = estabelecimentoService;
        this.usuarioRepository = usuarioRepository;
    }

    public SimuladorResponse calcular(SimuladorRequest request) {
        if (request.getDestinoId() == null) {
            return sugerirDestinos(request);
        }

        Destino destino = destinoService.buscarEntidade(request.getDestinoId());
        ResultadoCalculo resultado = calcularCustos(destino, request.getNumeroDias(), request.getOrcamento());

        SimuladorResponse response = construirResponse(request, destino, resultado);
        response.setHoteisSugeridos(estabelecimentoService.sugerirHoteis(destino.getId()));
        response.setRestaurantesSugeridos(estabelecimentoService.sugerirRestaurantes(destino.getId()));

        if (request.isGuardar()) {
            SimulacaoViagem simulacao = persistirSimulacao(request, destino, resultado);
            response.setSimulacaoId(simulacao.getId());
            response.setCriadoEm(simulacao.getCriadoEm());
        }

        return response;
    }

    @Transactional(readOnly = true)
    public List<SimuladorResponse> listarSimulacoes() {
        return simulacaoViagemRepository.findByUsuarioIdOrderByCriadoEmDesc(getUsuarioAtual().getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public SimuladorResponse buscarSimulacao(Long id) {
        return toResponse(buscarEntidade(id));
    }

    public void removerSimulacao(Long id) {
        simulacaoViagemRepository.delete(buscarEntidade(id));
    }

    private SimuladorResponse sugerirDestinos(SimuladorRequest request) {
        List<Destino> destinos = destinoRepository.findDestinosViaveis(
                request.getOrcamento(),
                request.getNumeroDias(),
                request.getTipoExperiencia(),
                CUSTO_DIARIO_PADRAO);

        SimuladorResponse response = new SimuladorResponse();
        response.setOrcamento(request.getOrcamento());
        response.setNumeroDias(request.getNumeroDias());
        response.setTipoExperiencia(request.getTipoExperiencia());
        response.setDestinosSugeridos(destinos.stream()
                .map(destino -> toDestinoSugerido(destino, request.getNumeroDias(), request.getOrcamento()))
                .toList());

        if (response.getDestinosSugeridos().isEmpty()) {
            response.setMensagem("Nenhum destino encontrado dentro do orcamento informado. Tente aumentar o orcamento ou reduzir os dias.");
        } else {
            response.setMensagem("Destinos sugeridos com base no orcamento e preferencias.");
        }

        return response;
    }

    private SimuladorResponse construirResponse(SimuladorRequest request, Destino destino, ResultadoCalculo resultado) {
        SimuladorResponse response = new SimuladorResponse();
        response.setTitulo(request.getTitulo());
        response.setDestinoId(destino.getId());
        response.setDestinoNome(destino.getNome());
        response.setDestinoCidade(destino.getCidade());
        response.setDestinoProvincia(destino.getProvincia());
        response.setOrcamento(request.getOrcamento());
        response.setNumeroDias(request.getNumeroDias());
        response.setTipoExperiencia(request.getTipoExperiencia() != null
                ? request.getTipoExperiencia()
                : destino.getCategoria().getTipoExperiencia());
        response.setCustoHospedagem(resultado.custoHospedagem());
        response.setCustoAlimentacao(resultado.custoAlimentacao());
        response.setCustoTransporte(resultado.custoTransporte());
        response.setCustoAtividades(resultado.custoAtividades());
        response.setCustoTotal(resultado.custoTotal());
        response.setViagemViavel(resultado.viagemViavel());
        response.setSaldoRestante(resultado.saldoRestante());
        response.setMensagem(resultado.viagemViavel()
                ? "Viagem viavel dentro do orcamento informado."
                : "O custo estimado excede o orcamento. Considere aumentar o orcamento ou escolher outro destino.");
        return response;
    }

    private SimulacaoViagem persistirSimulacao(SimuladorRequest request, Destino destino, ResultadoCalculo resultado) {
        SimulacaoViagem simulacao = new SimulacaoViagem();
        simulacao.setTitulo(request.getTitulo());
        simulacao.setOrcamento(request.getOrcamento());
        simulacao.setNumeroDias(request.getNumeroDias());
        simulacao.setTipoExperiencia(request.getTipoExperiencia() != null
                ? request.getTipoExperiencia()
                : destino.getCategoria().getTipoExperiencia());
        simulacao.setDestino(destino);
        simulacao.setCustoHospedagem(resultado.custoHospedagem());
        simulacao.setCustoAlimentacao(resultado.custoAlimentacao());
        simulacao.setCustoTransporte(resultado.custoTransporte());
        simulacao.setCustoAtividades(resultado.custoAtividades());
        simulacao.setCustoTotal(resultado.custoTotal());
        simulacao.setViagemViavel(resultado.viagemViavel());
        simulacao.setSaldoRestante(resultado.saldoRestante());
        simulacao.setUsuario(getUsuarioAtual());
        return simulacaoViagemRepository.save(simulacao);
    }

    private ResultadoCalculo calcularCustos(Destino destino, Integer numeroDias, BigDecimal orcamento) {
        BigDecimal custoDiario = destino.getPrecoMedioEstimado() != null
                ? destino.getPrecoMedioEstimado()
                : CUSTO_DIARIO_PADRAO;

        BigDecimal custoTotal = custoDiario
                .multiply(BigDecimal.valueOf(numeroDias))
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal custoHospedagem = custoTotal.multiply(PERCENT_HOSPEDAGEM).setScale(2, RoundingMode.HALF_UP);
        BigDecimal custoAlimentacao = custoTotal.multiply(PERCENT_ALIMENTACAO).setScale(2, RoundingMode.HALF_UP);
        BigDecimal custoTransporte = custoTotal.multiply(PERCENT_TRANSPORTE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal custoAtividades = custoTotal.multiply(PERCENT_ATIVIDADES).setScale(2, RoundingMode.HALF_UP);

        BigDecimal saldoRestante = orcamento.subtract(custoTotal).setScale(2, RoundingMode.HALF_UP);
        boolean viagemViavel = saldoRestante.compareTo(BigDecimal.ZERO) >= 0;

        return new ResultadoCalculo(
                custoHospedagem,
                custoAlimentacao,
                custoTransporte,
                custoAtividades,
                custoTotal,
                viagemViavel,
                saldoRestante
        );
    }

    private DestinoSugeridoResponse toDestinoSugerido(Destino destino, Integer numeroDias, BigDecimal orcamento) {
        ResultadoCalculo resultado = calcularCustos(destino, numeroDias, orcamento);

        DestinoSugeridoResponse sugerido = new DestinoSugeridoResponse();
        sugerido.setId(destino.getId());
        sugerido.setNome(destino.getNome());
        sugerido.setCidade(destino.getCidade());
        sugerido.setProvincia(destino.getProvincia());
        sugerido.setPrecoMedioEstimado(destino.getPrecoMedioEstimado() != null
                ? destino.getPrecoMedioEstimado()
                : CUSTO_DIARIO_PADRAO);
        sugerido.setCustoTotalEstimado(resultado.custoTotal());
        sugerido.setViavel(resultado.viagemViavel());
        return sugerido;
    }

    private SimuladorResponse toResponse(SimulacaoViagem simulacao) {
        SimuladorResponse response = new SimuladorResponse();
        response.setSimulacaoId(simulacao.getId());
        response.setTitulo(simulacao.getTitulo());
        response.setDestinoId(simulacao.getDestino().getId());
        response.setDestinoNome(simulacao.getDestino().getNome());
        response.setDestinoCidade(simulacao.getDestino().getCidade());
        response.setDestinoProvincia(simulacao.getDestino().getProvincia());
        response.setOrcamento(simulacao.getOrcamento());
        response.setNumeroDias(simulacao.getNumeroDias());
        response.setTipoExperiencia(simulacao.getTipoExperiencia());
        response.setCustoHospedagem(simulacao.getCustoHospedagem());
        response.setCustoAlimentacao(simulacao.getCustoAlimentacao());
        response.setCustoTransporte(simulacao.getCustoTransporte());
        response.setCustoAtividades(simulacao.getCustoAtividades());
        response.setCustoTotal(simulacao.getCustoTotal());
        response.setViagemViavel(simulacao.isViagemViavel());
        response.setSaldoRestante(simulacao.getSaldoRestante());
        response.setCriadoEm(simulacao.getCriadoEm());
        response.setMensagem(simulacao.isViagemViavel()
                ? "Viagem viavel dentro do orcamento informado."
                : "O custo estimado excede o orcamento.");
        return response;
    }

    private SimulacaoViagem buscarEntidade(Long id) {
        return simulacaoViagemRepository.findByIdAndUsuarioId(id, getUsuarioAtual().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Simulacao nao encontrada com id: " + id));
    }

    private Usuario getUsuarioAtual() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new RegraNegocioException("Utilizador nao autenticado.");
        }
        return usuarioRepository.findByEmailIgnoreCase(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Utilizador nao encontrado: " + auth.getName()));
    }

    private record ResultadoCalculo(
            BigDecimal custoHospedagem,
            BigDecimal custoAlimentacao,
            BigDecimal custoTransporte,
            BigDecimal custoAtividades,
            BigDecimal custoTotal,
            boolean viagemViavel,
            BigDecimal saldoRestante
    ) {
    }
}
