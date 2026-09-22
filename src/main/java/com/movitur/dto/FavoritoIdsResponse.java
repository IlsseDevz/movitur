package com.movitur.dto;

import java.util.List;

public class FavoritoIdsResponse {

    private List<Long> destinoIds;
    private List<Long> guiaIds;

    public FavoritoIdsResponse(List<Long> destinoIds, List<Long> guiaIds) {
        this.destinoIds = destinoIds;
        this.guiaIds = guiaIds;
    }

    public List<Long> getDestinoIds() {
        return destinoIds;
    }

    public List<Long> getGuiaIds() {
        return guiaIds;
    }
}
