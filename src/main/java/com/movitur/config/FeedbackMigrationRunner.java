package com.movitur.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class FeedbackMigrationRunner {

    private static final Logger log = LoggerFactory.getLogger(FeedbackMigrationRunner.class);

    private final JdbcTemplate jdbcTemplate;

    public FeedbackMigrationRunner(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void migrarFeedbacksLegados() {
        try {
            Integer destinoCol = jdbcTemplate.queryForObject(
                    """
                    SELECT COUNT(*) FROM information_schema.columns
                    WHERE table_schema = DATABASE()
                      AND table_name = 'feedbacks'
                      AND column_name = 'destino_id'
                    """,
                    Integer.class);

            if (destinoCol == null || destinoCol == 0) {
                return;
            }

            int atualizados = jdbcTemplate.update(
                    """
                    UPDATE feedbacks f
                    JOIN destinos d ON d.id = f.destino_id
                    SET f.tipo_alvo = 'DESTINO',
                        f.entidade_id = f.destino_id,
                        f.entidade_nome = d.nome
                    WHERE (f.entidade_id IS NULL OR f.entidade_id = 0)
                      AND f.destino_id IS NOT NULL
                    """);

            if (atualizados > 0) {
                log.info("Migrados {} feedback(s) legado(s) para o novo formato.", atualizados);
            }
        } catch (Exception ex) {
            log.warn("Migracao de feedbacks legados ignorada: {}", ex.getMessage());
        }
    }
}
