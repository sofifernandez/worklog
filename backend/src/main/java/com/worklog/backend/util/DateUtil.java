package com.worklog.backend.util;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class DateUtil {

    public static final String DATE_FORMAT = "yyyy-MM-dd";
    public static final String DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
    public static final String TIME_FORMAT = "HH:mm";

    private DateUtil() {
        throw new UnsupportedOperationException("Utility class");
    }

    public static LocalDate parseLocalDate(String dateStr) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DATE_FORMAT);
        return LocalDate.parse(dateStr, formatter);
    }

    public static Timestamp toStartOfDayTimestamp(LocalDate date) {
        return date != null ? Timestamp.valueOf(date.atStartOfDay()) : null;
    }

    public static Timestamp toEndOfDayTimestamp(LocalDate date) {
        return date != null ? Timestamp.valueOf(date.plusDays(1).atStartOfDay()) : null;
    }

    public static LocalDate parseIfValid(String dateStr) {
        return (dateStr != null && !dateStr.isBlank()) ? parseLocalDate(dateStr) : null;
    }

    public static Timestamp toStartOfDayTimestamp(String dateStr) {
        LocalDate date = parseIfValid(dateStr);
        return toStartOfDayTimestamp(date);
    }

    public static Timestamp toEndOfDayTimestamp(String dateStr) {
        LocalDate date = parseIfValid(dateStr);
        return toEndOfDayTimestamp(date);
    }

    public static Timestamp toTimestampFromTime(String timeStr) {
        if (timeStr == null || timeStr.isBlank()) {
            return null;
        }
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(TIME_FORMAT);
        LocalTime time = LocalTime.parse(timeStr, formatter);
        LocalDateTime dateTime = LocalDateTime.of(LocalDate.now(), time);
        return Timestamp.valueOf(dateTime);
    }

    public static boolean isBeforeToday(Timestamp timestamp) {
        if (timestamp == null) {
            return false;
        }
        LocalDate date = timestamp.toLocalDateTime().toLocalDate();
        return date.isBefore(LocalDate.now());
    }

    public static boolean isBefore4PM() {
        LocalTime currentTime = LocalTime.now();
        LocalTime fivePM = LocalTime.of(16, 0);
        return currentTime.isBefore(fivePM);
    }
}
