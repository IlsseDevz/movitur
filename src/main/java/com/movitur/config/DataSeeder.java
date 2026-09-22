package com.movitur.config;

import com.movitur.entity.Categoria;
import com.movitur.entity.Destino;
import com.movitur.entity.GuiaTuristico;
import com.movitur.entity.Role;
import com.movitur.entity.StatusConta;
import com.movitur.entity.TipoExperiencia;
import com.movitur.entity.Usuario;
import com.movitur.entity.Estabelecimento;
import com.movitur.entity.PlanoAnuncio;
import com.movitur.entity.StatusPagamentoEstabelecimento;
import com.movitur.entity.TipoEstabelecimento;
import com.movitur.repository.CategoriaRepository;
import com.movitur.repository.EstabelecimentoRepository;
import com.movitur.repository.DestinoRepository;
import com.movitur.repository.GuiaTuristicoRepository;
import com.movitur.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final CategoriaRepository categoriaRepository;
    private final DestinoRepository destinoRepository;
    private final GuiaTuristicoRepository guiaTuristicoRepository;
    private final EstabelecimentoRepository estabelecimentoRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${movitur.admin.email}")
    private String adminEmail;
    @Value("${movitur.admin.senha}")
    private String adminSenha;
    @Value("${movitur.admin.nome}")
    private String adminNome;

    public DataSeeder(
            CategoriaRepository categoriaRepository,
            DestinoRepository destinoRepository,
            GuiaTuristicoRepository guiaTuristicoRepository,
            EstabelecimentoRepository estabelecimentoRepository,
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder) {
        this.categoriaRepository = categoriaRepository;
        this.destinoRepository = destinoRepository;
        this.guiaTuristicoRepository = guiaTuristicoRepository;
        this.estabelecimentoRepository = estabelecimentoRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedAdmin();
        seedCatalogo();
        backfillCoordenadas();
        seedEstabelecimentos();
    }

    private void seedAdmin() {
        if (usuarioRepository.countByRole(Role.ADMIN) > 0) {
            log.info("Admin ja existe. Criacao de admin ignorada.");
            return;
        }
        Usuario admin = new Usuario();
        admin.setNomeCompleto(adminNome);
        admin.setEmail(adminEmail.toLowerCase());
        admin.setSenha(passwordEncoder.encode(adminSenha));
        admin.setRole(Role.ADMIN);
        admin.setStatus(StatusConta.APROVADO);
        usuarioRepository.save(admin);
        log.info("Admin inicial criado: {} (senha definida via configuracao).", adminEmail);
    }

    private void seedCatalogo() {
        if (categoriaRepository.count() > 0) {
            log.info("Base de dados ja contem dados de catalogo. Seeder de catalogo ignorado.");
            return;
        }

        log.info("A popular a base de dados com dados de exemplo de Mocambique...");

        Categoria praia = criarCategoria("Praia", "Praias paradisiacas e ilhas de aguas cristalinas", TipoExperiencia.PRAIA);
        Categoria aventura = criarCategoria("Aventura", "Safaris, trilhos e experiencias na natureza selvagem", TipoExperiencia.AVENTURA);
        Categoria cultura = criarCategoria("Cultura", "Historia, patrimonio e tradicoes mocambicanas", TipoExperiencia.CULTURA);
        Categoria luxo = criarCategoria("Luxo", "Resorts exclusivos e experiencias premium", TipoExperiencia.LUXO);
        Categoria familia = criarCategoria("Familia", "Destinos seguros e divertidos para toda a familia", TipoExperiencia.FAMILIA);

        categoriaRepository.saveAll(List.of(praia, aventura, cultura, luxo, familia));

        Destino tofo = criarDestino("Praia do Tofo", "Praia famosa pelo mergulho com tubaroes-baleia e mantas.",
                "Inhambane", "Tofo", new BigDecimal("4500.00"),
                "https://images.unsplash.com/photo-1544551763-46a013bb70d5", praia, -23.859, 35.548);
        Destino bazaruto = criarDestino("Arquipelago de Bazaruto", "Ilhas de dunas douradas e recifes de coral protegidos.",
                "Inhambane", "Vilankulo", new BigDecimal("12000.00"),
                "https://images.unsplash.com/photo-1506929562872-bb421503ef21", luxo, -21.633, 35.467);
        Destino ilhaMoc = criarDestino("Ilha de Mocambique", "Patrimonio Mundial da UNESCO, com arquitetura colonial unica.",
                "Nampula", "Ilha de Mocambique", new BigDecimal("3800.00"),
                "https://images.unsplash.com/photo-1571406252241-db0280bd36cd", cultura, -15.039, 40.734);
        Destino gorongosa = criarDestino("Parque Nacional da Gorongosa", "Um dos parques mais biodiversos de Africa, ideal para safaris.",
                "Sofala", "Gorongosa", new BigDecimal("7500.00"),
                "https://images.unsplash.com/photo-1516426122078-c23e76319801", aventura, -18.675, 34.492);
        Destino pontaOuro = criarDestino("Ponta do Ouro", "Praia no extremo sul, otima para mergulho com golfinhos.",
                "Maputo", "Ponta do Ouro", new BigDecimal("5000.00"),
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", praia, -26.847, 32.892);
        Destino quirimbas = criarDestino("Arquipelago das Quirimbas", "Ilhas remotas de beleza intocada e lodges de luxo.",
                "Cabo Delgado", "Ibo", new BigDecimal("11000.00"),
                "https://images.unsplash.com/photo-1439066615861-d1af74d74000", luxo, -12.763, 40.602);
        Destino maputo = criarDestino("Cidade de Maputo", "Capital vibrante com mercados, museus e vida noturna.",
                "Maputo", "Maputo", new BigDecimal("3000.00"),
                "https://images.unsplash.com/photo-1449824913935-59a10b8d2000", cultura, -25.969, 32.573);
        Destino bilene = criarDestino("Praia do Bilene", "Lagoa de aguas calmas, perfeita para familias.",
                "Gaza", "Bilene", new BigDecimal("3500.00"),
                "https://images.unsplash.com/photo-1519046904884-53103b34b206", familia, -25.183, 33.067);

        destinoRepository.saveAll(List.of(tofo, bazaruto, ilhaMoc, gorongosa, pontaOuro, quirimbas, maputo, bilene));

        GuiaTuristico ana = criarGuia("Ana Cumbe", "ana.cumbe@movitur.co.mz", "+258841234567",
                "Guia especializada em turismo de praia e mergulho, com 8 anos de experiencia em Inhambane.",
                8, 4.8, Set.of(tofo, bazaruto, pontaOuro));
        GuiaTuristico carlos = criarGuia("Carlos Machava", "carlos.machava@movitur.co.mz", "+258842345678",
                "Especialista em safaris e vida selvagem no Parque da Gorongosa.",
                12, 4.9, Set.of(gorongosa));
        GuiaTuristico fatima = criarGuia("Fatima Nurmamade", "fatima.n@movitur.co.mz", "+258843456789",
                "Guia cultural apaixonada pela historia da Ilha de Mocambique.",
                6, 4.7, Set.of(ilhaMoc, maputo));
        GuiaTuristico jose = criarGuia("Jose Tembe", "jose.tembe@movitur.co.mz", "+258844567890",
                "Guia familiar focado em experiencias seguras e divertidas no sul do pais.",
                5, 4.5, Set.of(bilene, pontaOuro, maputo));

        guiaTuristicoRepository.saveAll(List.of(ana, carlos, fatima, jose));

        log.info("Seeder concluido: {} categorias, {} destinos, {} guias.",
                categoriaRepository.count(), destinoRepository.count(), guiaTuristicoRepository.count());
    }

    private Categoria criarCategoria(String nome, String descricao, TipoExperiencia tipo) {
        Categoria c = new Categoria();
        c.setNome(nome);
        c.setDescricao(descricao);
        c.setTipoExperiencia(tipo);
        c.setAtivo(true);
        return c;
    }

    private Destino criarDestino(String nome, String descricao, String provincia, String cidade,
                                 BigDecimal precoDiario, String imagemUrl, Categoria categoria,
                                 double latitude, double longitude) {
        Destino d = new Destino();
        d.setNome(nome);
        d.setDescricao(descricao);
        d.setProvincia(provincia);
        d.setCidade(cidade);
        d.setPrecoMedioEstimado(precoDiario);
        d.setImagemUrl(imagemUrl);
        d.setCategoria(categoria);
        d.setLatitude(latitude);
        d.setLongitude(longitude);
        d.setAtivo(true);
        return d;
    }

    private void backfillCoordenadas() {
        Map<String, double[]> coords = Map.of(
                "Praia do Tofo", new double[]{-23.859, 35.548},
                "Arquipelago de Bazaruto", new double[]{-21.633, 35.467},
                "Ilha de Mocambique", new double[]{-15.039, 40.734},
                "Parque Nacional da Gorongosa", new double[]{-18.675, 34.492},
                "Ponta do Ouro", new double[]{-26.847, 32.892},
                "Arquipelago das Quirimbas", new double[]{-12.763, 40.602},
                "Cidade de Maputo", new double[]{-25.969, 32.573},
                "Praia do Bilene", new double[]{-25.183, 33.067}
        );

        int atualizados = 0;
        for (Destino destino : destinoRepository.findAll()) {
            if (destino.getLatitude() != null && destino.getLongitude() != null) {
                continue;
            }
            double[] c = coords.get(destino.getNome());
            if (c == null) {
                continue;
            }
            destino.setLatitude(c[0]);
            destino.setLongitude(c[1]);
            destinoRepository.save(destino);
            atualizados++;
        }
        if (atualizados > 0) {
            log.info("Backfill de coordenadas: {} destino(s) atualizado(s).", atualizados);
        }
    }

    private void seedEstabelecimentos() {
        if (estabelecimentoRepository.count() > 0) {
            return;
        }
        List<Destino> destinos = destinoRepository.findAll();
        if (destinos.isEmpty()) {
            return;
        }

        Destino maputo = destinos.stream().filter(d -> d.getNome().contains("Maputo")).findFirst().orElse(destinos.get(0));
        Destino tofo = destinos.stream().filter(d -> d.getNome().contains("Tofo")).findFirst().orElse(destinos.get(0));
        Destino bazaruto = destinos.stream().filter(d -> d.getNome().contains("Bazaruto")).findFirst().orElse(destinos.get(0));

        estabelecimentoRepository.saveAll(List.of(
                criarEstabelecimento("Hotel Polana Serena", "Hotel historico no coracao de Maputo.", TipoEstabelecimento.HOTEL,
                        maputo, new BigDecimal("8500.00"), 4.7, PlanoAnuncio.OURO, LocalDate.now().plusMonths(6),
                        "https://images.unsplash.com/photo-1566073771259-6a8506099945"),
                criarEstabelecimento("Restaurante Zambezi", "Cozinha mocambicana contemporanea.", TipoEstabelecimento.RESTAURANTE,
                        maputo, new BigDecimal("1200.00"), 4.5, PlanoAnuncio.PRATA, LocalDate.now().plusMonths(3),
                        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"),
                criarEstabelecimento("Pestana Inhambane", "Resort a beira-mar em Tofo.", TipoEstabelecimento.HOTEL,
                        tofo, new BigDecimal("6500.00"), 4.6, PlanoAnuncio.OURO, LocalDate.now().plusMonths(4),
                        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4"),
                criarEstabelecimento("Restaurante Bela Vista Tofo", "Marisco fresco com vista para o oceano.", TipoEstabelecimento.RESTAURANTE,
                        tofo, new BigDecimal("900.00"), 4.3, PlanoAnuncio.BRONZE, LocalDate.now().plusMonths(2),
                        "https://images.unsplash.com/photo-1559339352-11d035aa65de"),
                criarEstabelecimento("Anantara Bazaruto Lodge", "Luxo exclusivo no arquipelago.", TipoEstabelecimento.HOTEL,
                        bazaruto, new BigDecimal("15000.00"), 4.9, PlanoAnuncio.OURO, LocalDate.now().plusMonths(5),
                        "https://images.unsplash.com/photo-1571896349842-33c89424de2d"),
                criarEstabelecimento("Cafe Vilankulo", "Pequeno-almoco e petiscos locais.", TipoEstabelecimento.RESTAURANTE,
                        bazaruto, new BigDecimal("600.00"), 4.0, PlanoAnuncio.GRATUITO, null,
                        "https://images.unsplash.com/photo-1554118811-1e0d582782f8")
        ));
        log.info("Seeder de estabelecimentos: {} registos criados.", estabelecimentoRepository.count());
    }

    private Estabelecimento criarEstabelecimento(
            String nome, String descricao, TipoEstabelecimento tipo, Destino destino,
            BigDecimal precoMedio, double avaliacao, PlanoAnuncio plano, LocalDate expiracao, String imagemUrl) {
        Estabelecimento e = new Estabelecimento();
        e.setNome(nome);
        e.setDescricao(descricao);
        e.setTipo(tipo);
        e.setDestino(destino);
        e.setPrecoMedio(precoMedio);
        e.setAvaliacaoMedia(avaliacao);
        e.setPlanoAnuncio(plano);
        e.setStatusPagamento(plano == PlanoAnuncio.GRATUITO
                ? StatusPagamentoEstabelecimento.INATIVO
                : StatusPagamentoEstabelecimento.ATIVO);
        e.setDataExpiracao(expiracao);
        e.setPrioridadeExibicao(switch (plano) {
            case OURO -> 3;
            case PRATA -> 2;
            case BRONZE -> 1;
            default -> 0;
        });
        e.setImagemUrl(imagemUrl);
        e.setAtivo(true);
        return e;
    }

    private GuiaTuristico criarGuia(String nome, String email, String telefone, String biografia,
                                    int anosExperiencia, double avaliacao, Set<Destino> destinos) {
        GuiaTuristico g = new GuiaTuristico();
        g.setNome(nome);
        g.setEmail(email);
        g.setTelefone(telefone);
        g.setBiografia(biografia);
        g.setAnosExperiencia(anosExperiencia);
        g.setAvaliacaoMedia(avaliacao);
        g.setDestinos(destinos);
        g.setAtivo(true);
        return g;
    }
}
