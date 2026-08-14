package com.kjalumni.common.exception;

public class EmailNotVerifiedException extends RuntimeException
{
    public EmailNotVerifiedException(String message)
    {
        super(message);
    }
}
