package org.acme.models;

public class ResponseModel<T> {
    private T data;
    private String error;

    public ResponseModel(T data) {
        this.data = data;
    }

    public ResponseModel(String error) {
        this.error = error;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}
