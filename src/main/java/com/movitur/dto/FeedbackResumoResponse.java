package com.movitur.dto;

public class FeedbackResumoResponse {

    private long total;
    private double mediaEstrelas;

    public FeedbackResumoResponse() {
    }

    public FeedbackResumoResponse(long total, double mediaEstrelas) {
        this.total = total;
        this.mediaEstrelas = mediaEstrelas;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public double getMediaEstrelas() {
        return mediaEstrelas;
    }

    public void setMediaEstrelas(double mediaEstrelas) {
        this.mediaEstrelas = mediaEstrelas;
    }
}
