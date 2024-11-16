package com.tpi.server.infrastructure.exceptions;

import com.tpi.server.application.usecases.alert.AlertUseCase;
import jakarta.validation.ConstraintViolationException;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;


@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ErrorResponse {
        private int status;
        private String message;
        private List<String> errors;
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFoundException(UserNotFoundException ex) {
        return buildResponseEntity(HttpStatus.NOT_FOUND, ex.getMessage(), null);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleUserAlreadyExistsException(UserAlreadyExistsException ex) {
        return buildResponseEntity(HttpStatus.CONFLICT, ex.getMessage(), null);
    }

    @ExceptionHandler(DeviceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleDeviceNotFoundException(DeviceNotFoundException ex) {
        return buildResponseEntity(HttpStatus.NOT_FOUND, ex.getMessage(), null);
    }

    @ExceptionHandler(DeviceNotOwnerException.class)
    public ResponseEntity<ErrorResponse> handleDeviceNotOwnerException(DeviceNotOwnerException ex) {
        return buildResponseEntity(HttpStatus.FORBIDDEN, ex.getMessage(), null);
    }

    @ExceptionHandler(InvalidDataException.class)
    public ResponseEntity<ErrorResponse> handleInvalidDataException(InvalidDataException ex) {
        return buildResponseEntity(HttpStatus.BAD_REQUEST, ex.getMessage(), null);
    }

    @ExceptionHandler(AlertException.class)
    public void handleAlertException(AlertException ex) {
        logger.error(ex.getMessage());
    }

    @ExceptionHandler(AlertGetUserException.class)
    public void handleGetUserException(AlertGetUserException ex) {
        logger.error(ex.getMessage());
    }

    @ExceptionHandler(GetEmailForAlertException.class)
    public void handleGetEmailForAlertException(GetEmailForAlertException ex) {
        logger.error(ex.getMessage());
    }

    @ExceptionHandler(SendEmailException.class)
    public void handleSendEmailException(SendEmailException ex) {
        logger.error(ex.getMessage());
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolationException(ConstraintViolationException ex) {
        List<String> errors = ex.getConstraintViolations()
                .stream()
                .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
                .collect(Collectors.toList());

        return buildResponseEntity(HttpStatus.BAD_REQUEST, "Validación fallida", errors);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toList());

        return buildResponseEntity(HttpStatus.BAD_REQUEST, "Validación fallida", errors);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException ex) {
        String error = ex.getName() + " debería ser de tipo " + ex.getRequiredType().getSimpleName();
        return buildResponseEntity(HttpStatus.BAD_REQUEST, error, null);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErrorResponse> handleMissingServletRequestParameterException(MissingServletRequestParameterException ex) {
        String error = ex.getParameterName() + " es un parámetro requerido";
        return buildResponseEntity(HttpStatus.BAD_REQUEST, error, null);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        String error = "El cuerpo de la solicitud está mal formateado o contiene datos inválidos";
        return buildResponseEntity(HttpStatus.BAD_REQUEST, error, null);
    }

    @ExceptionHandler(DateTimeParseException.class)
    public ResponseEntity<ErrorResponse> handleDateTimeParseException(DateTimeParseException ex) {
        String error = "El formato de la fecha es inválido. Debería ser ISO-8601, ejemplo, '2023-10-10T10:00:00Z'.";
        return buildResponseEntity(HttpStatus.BAD_REQUEST, error, null);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneralException(Exception ex) {
        // Puedes agregar logging aquí si es necesario
        return buildResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR, "Ocurrió un error no controlado.", null);
    }

    @ExceptionHandler(AddressNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleAddressNotFoundException(AddressNotFoundException ex) {
        return buildResponseEntity(HttpStatus.NOT_FOUND, ex.getMessage(), null);
    }

    @ExceptionHandler(AddressNotOwnedByUserException.class)
    public ResponseEntity<ErrorResponse> handleAddressNotOwnedByUserException(AddressNotOwnedByUserException ex) {
        return buildResponseEntity(HttpStatus.FORBIDDEN, ex.getMessage(), null);
    }

    private ResponseEntity<ErrorResponse> buildResponseEntity(HttpStatus status, String message, List<String> errors) {
        ErrorResponse.ErrorResponseBuilder builder = ErrorResponse.builder()
                .status(status.value())
                .message(message);

        if (errors != null) {
            builder.errors(errors);
        }

        return new ResponseEntity<>(builder.build(), status);
    }
}