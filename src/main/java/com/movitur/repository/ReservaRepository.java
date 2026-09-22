package com.movitur.repository;

import com.movitur.entity.Reserva;
import com.movitur.entity.StatusReserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    List<Reserva> findByUsuarioIdOrderByCriadoEmDesc(Long usuarioId);

    Optional<Reserva> findByIdAndUsuarioId(Long id, Long usuarioId);

    List<Reserva> findByStatusOrderByCriadoEmDesc(StatusReserva status);

    List<Reserva> findAllByOrderByCriadoEmDesc();

    @Query("SELECT r FROM Reserva r WHERE r.guia.id = :guiaId AND r.status IN :statuses")
    List<Reserva> findByGuiaIdAndStatusIn(@Param("guiaId") Long guiaId, @Param("statuses") List<StatusReserva> statuses);

    long countByStatus(StatusReserva status);

    @Query("""
            SELECT COALESCE(SUM(r.precoEstimado), 0) FROM Reserva r
            WHERE r.status = com.movitur.entity.StatusReserva.CONFIRMADA
            """)
    Double somarPrecoReservasConfirmadas();

    @Query("""
            SELECT r.destino.id, r.destino.nome, COUNT(r) FROM Reserva r
            GROUP BY r.destino.id, r.destino.nome
            ORDER BY COUNT(r) DESC
            """)
    List<Object[]> contarReservasPorDestino();
}
