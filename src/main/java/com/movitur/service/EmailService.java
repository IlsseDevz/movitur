package com.movitur.service;

import com.movitur.dto.email.PagamentoEmailData;
import com.movitur.dto.email.ReservaEmailData;
import com.movitur.dto.email.UsuarioEmailData;
import jakarta.mail.internet.InternetAddress;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final String remetente;
    private final String fromName;
    private final String adminEmail;
    private final String appUrl;

    public EmailService(
            JavaMailSender mailSender,
            TemplateEngine templateEngine,
            @Value("${spring.mail.username:}") String remetente,
            @Value("${movitur.mail.from-name:MoviTur}") String fromName,
            @Value("${movitur.admin.email:}") String adminEmail,
            @Value("${movitur.app.url:http://localhost:8080}") String appUrl) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
        this.remetente = remetente;
        this.fromName = fromName;
        this.adminEmail = adminEmail;
        this.appUrl = appUrl;
    }

    @Async
    public void enviarEmailBoasVindas(UsuarioEmailData usuario) {
        enviarMensagem(
                usuario.email(),
                "MoviTur - Bem-vindo(a)!",
                "Bem-vindo(a) a MoviTur",
                "Ola " + usuario.nomeCompleto() + ",",
                List.of(
                        "A sua conta foi criada com sucesso.",
                        "Ja pode explorar destinos, simular o seu orcamento e fazer reservas."
                ),
                null,
                "Iniciar sessao",
                appUrl + "/cliente/login"
        );
    }

    @Async
    public void enviarEmailNovoRegistoAdmin(UsuarioEmailData usuario) {
        if (!StringUtils.hasText(adminEmail)) {
            log.warn("Admin email nao configurado. Notificacao de novo registo NAO enviada.");
            return;
        }
        enviarMensagem(
                adminEmail,
                "MoviTur - Novo registo de cliente",
                "Novo registo pendente",
                "Ola Administrador,",
                List.of(
                        "Um novo cliente registou-se na plataforma MoviTur.",
                        "Nome: " + usuario.nomeCompleto(),
                        "Email: " + usuario.email(),
                        "Estado: PENDENTE (aguarda aprovacao)."
                ),
                null,
                "Rever utilizadores",
                appUrl + "/admin/usuarios"
        );
    }

    @Async
    public void enviarEmailRejeicao(UsuarioEmailData usuario, String motivo) {
        List<String> paragrafos = new ArrayList<>();
        paragrafos.add("Lamentamos informar que o seu registo na plataforma MoviTur nao foi aprovado.");
        if (StringUtils.hasText(motivo)) {
            paragrafos.add("Motivo: " + motivo);
        }
        paragrafos.add("Se achar que se trata de um engano, entre em contacto connosco.");

        enviarMensagem(
                usuario.email(),
                "MoviTur - Registo nao aprovado",
                "Registo nao aprovado",
                "Ola " + usuario.nomeCompleto() + ",",
                paragrafos,
                null,
                null,
                null
        );
    }

    @Async
    public void enviarEmailRecuperacaoSenha(UsuarioEmailData usuario, String token) {
        String link = appUrl + "/cliente/redefinir-senha?token=" + token;
        enviarMensagem(
                usuario.email(),
                "MoviTur - Recuperacao de senha",
                "Recuperacao de senha",
                "Ola " + usuario.nomeCompleto() + ",",
                List.of(
                        "Recebemos um pedido para redefinir a sua senha.",
                        "O link abaixo e valido por 1 hora.",
                        "Se nao fez este pedido, ignore este email."
                ),
                null,
                "Redefinir senha",
                link
        );
    }

    @Async
    public void enviarEmailSenhaAlterada(UsuarioEmailData usuario) {
        enviarMensagem(
                usuario.email(),
                "MoviTur - Senha alterada",
                "Senha alterada com sucesso",
                "Ola " + usuario.nomeCompleto() + ",",
                List.of(
                        "A senha da sua conta MoviTur foi alterada com sucesso.",
                        "Se nao reconhece esta alteracao, contacte-nos imediatamente."
                ),
                null,
                "Aceder a conta",
                appUrl + "/cliente/login"
        );
    }

    @Async
    public void enviarEmailReservaConfirmada(ReservaEmailData reserva) {
        enviarMensagem(
                reserva.clienteEmail(),
                "MoviTur - Reserva confirmada",
                "Reserva confirmada!",
                "Ola " + reserva.clienteNome() + ",",
                List.of("A sua reserva foi confirmada. Detalhes abaixo:", "Boa viagem!"),
                formatReservaDestaque(reserva),
                "Ver minhas reservas",
                appUrl + "/cliente/reservas"
        );
    }

    @Async
    public void enviarEmailReservaRejeitada(ReservaEmailData reserva) {
        enviarMensagem(
                reserva.clienteEmail(),
                "MoviTur - Reserva nao aprovada",
                "Reserva nao aprovada",
                "Ola " + reserva.clienteNome() + ",",
                List.of(
                        "Lamentamos informar que a sua reserva para " + reserva.destinoNome() + " nao foi aprovada.",
                        "Pode fazer um novo pedido com datas ou destinos diferentes."
                ),
                formatReservaDestaque(reserva),
                "Explorar destinos",
                appUrl + "/cliente/destinos"
        );
    }

    @Async
    public void enviarEmailReservaCancelada(ReservaEmailData reserva) {
        enviarMensagem(
                reserva.clienteEmail(),
                "MoviTur - Reserva cancelada",
                "Reserva cancelada",
                "Ola " + reserva.clienteNome() + ",",
                List.of("A sua reserva para " + reserva.destinoNome() + " foi cancelada."),
                formatReservaDestaque(reserva),
                "Ver minhas reservas",
                appUrl + "/cliente/reservas"
        );
    }

    @Async
    public void enviarEmailNovaReservaCliente(ReservaEmailData reserva) {
        enviarMensagem(
                reserva.clienteEmail(),
                "MoviTur - Pedido de reserva recebido",
                "Pedido de reserva recebido",
                "Ola " + reserva.clienteNome() + ",",
                List.of(
                        "Recebemos o seu pedido de reserva.",
                        "Estado: PENDENTE (a aguardar confirmacao do administrador)."
                ),
                formatReservaDestaque(reserva),
                "Ver minhas reservas",
                appUrl + "/cliente/reservas"
        );
    }

    @Async
    public void enviarEmailNovaReservaAdmin(ReservaEmailData reserva) {
        if (!StringUtils.hasText(adminEmail)) {
            log.warn("Admin email nao configurado. Notificacao de nova reserva NAO enviada.");
            return;
        }
        enviarMensagem(
                adminEmail,
                "MoviTur - Nova reserva pendente (#" + reserva.id() + ")",
                "Nova reserva pendente",
                "Ola administrador,",
                List.of("Foi recebida uma nova reserva que aguarda a sua accao."),
                "Cliente: " + reserva.clienteNome() + " (" + reserva.clienteEmail() + ")\n"
                        + formatReservaDestaque(reserva),
                "Gerir reservas",
                appUrl + "/admin/reservas"
        );
    }

    @Async
    public void enviarEmailPagamentoConfirmado(PagamentoEmailData pagamento) {
        enviarMensagem(
                pagamento.clienteEmail(),
                "MoviTur - Pagamento confirmado",
                "Pagamento confirmado",
                "Ola " + pagamento.clienteNome() + ",",
                List.of("O seu pagamento foi confirmado com sucesso."),
                formatPagamentoDestaque(pagamento),
                "Ver minhas reservas",
                appUrl + "/cliente/reservas"
        );
    }

    @Async
    public void enviarEmailPagamentoPendente(PagamentoEmailData pagamento) {
        enviarMensagem(
                pagamento.clienteEmail(),
                "MoviTur - Pagamento em analise",
                "Pagamento em analise",
                "Ola " + pagamento.clienteNome() + ",",
                List.of(
                        "Recebemos o seu pedido de pagamento.",
                        "A referencia sera verificada pela nossa equipa em breve."
                ),
                formatPagamentoDestaque(pagamento),
                "Ver minhas reservas",
                appUrl + "/cliente/reservas"
        );
    }

    @Async
    public void enviarEmailPagamentoRejeitado(PagamentoEmailData pagamento) {
        List<String> paragrafos = new ArrayList<>();
        paragrafos.add("Nao foi possivel confirmar o pagamento de " + formatMoney(pagamento.valor()) + ".");
        if (StringUtils.hasText(pagamento.motivoRejeicao())) {
            paragrafos.add("Motivo: " + pagamento.motivoRejeicao());
        }
        paragrafos.add("Pode submeter um novo pagamento com a referencia correta.");

        enviarMensagem(
                pagamento.clienteEmail(),
                "MoviTur - Pagamento nao confirmado",
                "Pagamento nao confirmado",
                "Ola " + pagamento.clienteNome() + ",",
                paragrafos,
                formatPagamentoDestaque(pagamento),
                "Ver minhas reservas",
                appUrl + "/cliente/reservas"
        );
    }

    @Async
    public void enviarEmailPagamentoPendenteAdmin(PagamentoEmailData pagamento) {
        if (!StringUtils.hasText(adminEmail)) {
            log.warn("Admin email nao configurado. Notificacao de pagamento pendente NAO enviada.");
            return;
        }
        enviarMensagem(
                adminEmail,
                "MoviTur - Pagamento pendente (#" + pagamento.id() + ")",
                "Pagamento pendente de verificacao",
                "Ola administrador,",
                List.of("Um novo pagamento aguarda verificacao."),
                "Cliente: " + pagamento.clienteNome() + " (" + pagamento.clienteEmail() + ")\n"
                        + formatPagamentoDestaque(pagamento),
                "Verificar pagamentos",
                appUrl + "/admin/pagamentos"
        );
    }

    private String formatReservaDestaque(ReservaEmailData reserva) {
        StringBuilder sb = new StringBuilder();
        sb.append("Reserva #").append(reserva.id()).append("\n");
        sb.append("Destino: ").append(reserva.destinoNome()).append(" (").append(reserva.destinoCidade()).append(")\n");
        sb.append("Data de inicio: ").append(reserva.dataInicio()).append("\n");
        sb.append("Duracao: ").append(reserva.numeroDias()).append(" dias\n");
        sb.append("Pessoas: ").append(reserva.numeroPessoas()).append("\n");
        if (reserva.precoEstimado() != null) {
            sb.append("Preco estimado: ").append(formatMoney(reserva.precoEstimado())).append("\n");
        }
        if (StringUtils.hasText(reserva.guiaNome())) {
            sb.append("Guia: ").append(reserva.guiaNome()).append("\n");
        }
        return sb.toString().trim();
    }

    private String formatPagamentoDestaque(PagamentoEmailData pagamento) {
        StringBuilder sb = new StringBuilder();
        sb.append("Pagamento #").append(pagamento.id()).append("\n");
        sb.append("Reserva: ").append(pagamento.destinoNome()).append("\n");
        sb.append("Valor: ").append(formatMoney(pagamento.valor())).append("\n");
        sb.append("Metodo: ").append(pagamento.metodo()).append("\n");
        if (StringUtils.hasText(pagamento.referencia())) {
            sb.append("Referencia: ").append(pagamento.referencia()).append("\n");
        }
        if (pagamento.totalPago() != null && pagamento.precoEstimado() != null) {
            sb.append("Total pago: ").append(formatMoney(pagamento.totalPago()))
                    .append(" de ").append(formatMoney(pagamento.precoEstimado())).append("\n");
            sb.append("Estado: ").append(pagamento.statusPagamento()).append("\n");
        }
        return sb.toString().trim();
    }

    private void enviarMensagem(
            String destinatario,
            String assunto,
            String titulo,
            String saudacao,
            List<String> paragrafos,
            String destaque,
            String botaoTexto,
            String botaoUrl) {
        if (!StringUtils.hasText(remetente)) {
            log.warn("Email nao configurado (spring.mail.username vazio). Email para {} NAO enviado. Assunto: {}",
                    destinatario, assunto);
            return;
        }

        String textoPlano = construirTextoPlano(titulo, saudacao, paragrafos, destaque, botaoTexto, botaoUrl);
        String html = renderizarHtml(assunto, titulo, saudacao, paragrafos, destaque, botaoTexto, botaoUrl);

        try {
            var message = mailSender.createMimeMessage();
            var helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(new InternetAddress(remetente, fromName));
            helper.setTo(destinatario);
            helper.setSubject(assunto);
            helper.setText(textoPlano, html);
            mailSender.send(message);
            log.info("Email '{}' enviado para {}", assunto, destinatario);
        } catch (Exception ex) {
            log.error("Falha ao enviar email para {}: {}", destinatario, ex.getMessage());
        }
    }

    private String renderizarHtml(
            String assunto,
            String titulo,
            String saudacao,
            List<String> paragrafos,
            String destaque,
            String botaoTexto,
            String botaoUrl) {
        Context context = new Context();
        context.setVariables(Map.of(
                "assunto", assunto,
                "titulo", titulo,
                "saudacao", saudacao,
                "paragrafos", paragrafos,
                "destaque", destaque != null ? destaque : "",
                "botaoTexto", botaoTexto != null ? botaoTexto : "",
                "botaoUrl", botaoUrl != null ? botaoUrl : "",
                "appUrl", appUrl
        ));
        return templateEngine.process("email/mensagem", context);
    }

    private String construirTextoPlano(
            String titulo,
            String saudacao,
            List<String> paragrafos,
            String destaque,
            String botaoTexto,
            String botaoUrl) {
        StringBuilder sb = new StringBuilder();
        sb.append(titulo).append("\n\n");
        sb.append(saudacao).append("\n\n");
        for (String paragrafo : paragrafos) {
            sb.append(paragrafo).append("\n\n");
        }
        if (StringUtils.hasText(destaque)) {
            sb.append(destaque).append("\n\n");
        }
        if (StringUtils.hasText(botaoUrl)) {
            sb.append(botaoTexto).append(": ").append(botaoUrl).append("\n\n");
        }
        sb.append("Equipa MoviTur");
        return sb.toString();
    }

    private String formatMoney(Double valor) {
        if (valor == null) {
            return "0,00 MZN";
        }
        return String.format("%,.2f MZN", valor).replace(',', 'X').replace('.', ',').replace('X', '.');
    }

    private String formatMoney(double valor) {
        return formatMoney(Double.valueOf(valor));
    }
}
