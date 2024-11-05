package com.tpi.server.domain.enums;

import com.tpi.server.domain.models.Measurement;

import java.util.Arrays;
import java.util.Map;
import java.util.function.BiConsumer;
import java.util.function.Function;
import java.util.stream.Collectors;

public enum MeasurementField {
    VOLTAGE("voltage", Measurement::getVoltage, Measurement::setVoltage),
    CURRENT("current", Measurement::getCurrent, Measurement::setCurrent),
    POWER("power", Measurement::getPower, Measurement::setPower),
    ENERGY("energy", Measurement::getEnergy, Measurement::setEnergy),
    TEMPERATURE("temperature", Measurement::getTemperature, Measurement::setTemperature),
    HUMIDITY("humidity", Measurement::getHumidity, Measurement::setHumidity);

    private final String fieldName;
    private final Function<Measurement, Double> getter;
    private final BiConsumer<Measurement, Double> setter;

    MeasurementField(String fieldName, Function<Measurement, Double> getter, BiConsumer<Measurement, Double> setter) {
        this.fieldName = fieldName;
        this.getter = getter;
        this.setter = setter;
    }

    public String getFieldName() {
        return fieldName;
    }

    public Function<Measurement, Double> getGetter() {
        return getter;
    }

    public BiConsumer<Measurement, Double> getSetter() {
        return setter;
    }

    private static final Map<String, MeasurementField> FIELD_MAP = Arrays.stream(values())
            .collect(Collectors.toMap(MeasurementField::getFieldName, Function.identity()));

    public static MeasurementField fromFieldName(String fieldName) {
        return FIELD_MAP.get(fieldName);
    }

    public void setField(Measurement measurement, Double value) {
        setter.accept(measurement, value);
    }
}
