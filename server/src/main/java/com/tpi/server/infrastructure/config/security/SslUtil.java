package com.tpi.server.infrastructure.config.security;

import javax.net.ssl.*;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
public class SslUtil {

    public static SSLSocketFactory getSocketFactory(final String caCrtFile,
                                                    final String crtFile, final String keyFile) throws Exception {
        // Acepta todos los certificados -  Solo para pruebas
        SSLContext sc = SSLContext.getInstance("TLSv1.2");
        sc.init(null, trustAllCerts, new SecureRandom());
        return sc.getSocketFactory();
    }

    private static TrustManager[] trustAllCerts = new TrustManager[]{
            new X509TrustManager() {
                public java.security.cert.X509Certificate[] getAcceptedIssuers() { return null; }
                public void checkClientTrusted(X509Certificate[] certs, String authType) { }
                public void checkServerTrusted(X509Certificate[] certs, String authType) { }
            }
    };
}