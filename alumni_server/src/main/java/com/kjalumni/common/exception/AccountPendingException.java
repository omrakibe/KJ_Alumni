package com.kjalumni.common.exception;

public class AccountPendingException extends RuntimeException
{
    public AccountPendingException(String message)
    {
        super(message);
    }
}
