package com.tpi.server.infrastructure.utils;

import com.tpi.server.domain.enums.AlertType;

public class AlertMessageUtils {
    public static String getAlertMessage(AlertType type) {
        return type.getMessage();
    }
}
