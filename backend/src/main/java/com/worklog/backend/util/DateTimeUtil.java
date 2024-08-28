package com.worklog.backend.util;

import com.worklog.backend.exception.InvalidDataException;

import java.sql.Timestamp;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;

public class DateTimeUtil {

    public static final String DATE_FORMAT = "yyyy-MM-dd";
    public static final String TIME_FORMAT = "HH:mm";

    public static final LocalTime MONDAY_TO_FRIDAY_START = LocalTime.of(7, 0);
    public static final LocalTime MONDAY_TO_THURSDAY_END = LocalTime.of(16, 30);
    public static final LocalTime FRIDAY_END = LocalTime.of(15, 30);
    public static final double MONDAY_TO_THURSDAY_WH= 9.5;
    public static final double FRIDAY_WH= 8.5;



    private DateTimeUtil() {
        throw new UnsupportedOperationException("Utility class");
    }

    public static LocalDate parseLocalDate(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return null;
        }
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DATE_FORMAT);
        try {
            return LocalDate.parse(dateStr, formatter);
        } catch (DateTimeParseException e) {
            return null;
        }
    }

    public static Timestamp toTimestampFromTime(String timeStr) {
        if (timeStr == null || timeStr.isBlank()) {
            return null;
        }
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(TIME_FORMAT);
        try {
            LocalTime time = LocalTime.parse(timeStr, formatter);
            LocalDateTime dateTime = LocalDateTime.of(LocalDate.now(), time);
            return Timestamp.valueOf(dateTime);
        } catch (DateTimeParseException e){
            return null;
        }

    }

    public static boolean isValidTimeRange(Timestamp start, Timestamp end) {
        if (start.after(end)) {
            return false; // start time cannot be after end time
        }

        long differenceInMinutes = Duration.between(start.toInstant(), end.toInstant()).toMinutes();
        return differenceInMinutes >= 30; // There must be at least a 30-minute difference
    }


    public static boolean isBeforeToday(LocalDate date) {
        LocalDate today = LocalDate.now(ZoneId.systemDefault());
        return date.isBefore(today);
    }


    public static boolean isBeforeStartOfWorkDay() {
        LocalTime currentTime = LocalTime.now();
        LocalTime sevenAM = LocalTime.of(7, 0);
        return currentTime.isBefore(sevenAM);
    }

    public static boolean isWithinWorkingHours() {
        LocalDateTime now = LocalDateTime.now();
        DayOfWeek dayOfWeek = now.getDayOfWeek();
        LocalTime currentTime = now.toLocalTime();

        if (dayOfWeek == DayOfWeek.FRIDAY) {
            return currentTime.isAfter(MONDAY_TO_FRIDAY_START) && currentTime.isBefore(FRIDAY_END);
        } else if (dayOfWeek != DayOfWeek.SATURDAY && dayOfWeek != DayOfWeek.SUNDAY) {
            return currentTime.isAfter(MONDAY_TO_FRIDAY_START) && currentTime.isBefore(MONDAY_TO_THURSDAY_END);
        } else {
            return false;
        }
    }

    public static boolean isTimeStampWithinWorkingHours(Timestamp timestamp){
        LocalDateTime localDateTime = timestamp.toLocalDateTime();
        LocalTime currentTime = localDateTime.toLocalTime();
        DayOfWeek dayOfWeek = localDateTime.getDayOfWeek();
        boolean isAfterStartOfDay = currentTime.isAfter(MONDAY_TO_FRIDAY_START) || currentTime.equals(MONDAY_TO_FRIDAY_START);
        boolean isBeforeEndOfDay =false;
        if(dayOfWeek == DayOfWeek.FRIDAY){
            isBeforeEndOfDay = currentTime.isBefore(FRIDAY_END) || currentTime.equals(FRIDAY_END);;
        } else {
            isBeforeEndOfDay=currentTime.isBefore(MONDAY_TO_THURSDAY_END);
        }
        return isAfterStartOfDay && isBeforeEndOfDay;
    }

    public static boolean isDateToday(LocalDate fecha){
        LocalDate today = LocalDate.now(ZoneId.systemDefault());
        return fecha.equals(today);
    }

    public static boolean isDateTomorrow(LocalDate date) {
        LocalDate tomorrow = LocalDate.now(ZoneId.systemDefault()).plusDays(1);
        return date.equals(tomorrow);
    }


    public static boolean isDateAfterTomorrowOrLater(LocalDate date) {
        LocalDate dayAfterTomorrow = LocalDate.now(ZoneId.systemDefault()).plusDays(2);
        return date.isAfter(dayAfterTomorrow);
    }


    public static Timestamp getEndOfWorkdayTimestamp(LocalDate inputDate) {
        if (inputDate == null) {
            return null;
        }

        LocalTime endOfDayTime;

        switch (inputDate.getDayOfWeek()) {
            case FRIDAY:
                endOfDayTime = FRIDAY_END;
                break;
            case SATURDAY:
            case SUNDAY:
                return null; // Assuming no work on weekends
            default:
                endOfDayTime = MONDAY_TO_THURSDAY_END;
                break;
        }

        LocalDateTime endOfWorkdayDateTime = LocalDateTime.of(inputDate, endOfDayTime);
        return Timestamp.valueOf(endOfWorkdayDateTime);
    }

    public static boolean isAfterWorkingHours(Timestamp timestamp) {
        LocalDateTime dateTime = timestamp.toLocalDateTime();
        DayOfWeek dayOfWeek = dateTime.getDayOfWeek();
        LocalTime endOfWorkingHours;

        if (dayOfWeek == DayOfWeek.FRIDAY) {
            endOfWorkingHours = FRIDAY_END;
        } else {
            endOfWorkingHours = MONDAY_TO_THURSDAY_END;
        }

        return dateTime.toLocalTime().isAfter(endOfWorkingHours);
    }

    public static boolean isFuture(LocalDate date) {
        LocalDate today = LocalDate.now();
        return date.isAfter(today);
    }

    public static boolean compareTimestampToLocalTime(Timestamp timestamp, LocalTime localTime) {
        // Step 1: Convert Timestamp to LocalDateTime
        LocalDateTime localDateTime = timestamp.toLocalDateTime();

        // Step 2: Extract LocalTime from LocalDateTime
        LocalTime timeFromTimestamp = localDateTime.toLocalTime();

        // Step 3: Compare the extracted LocalTime with the given LocalTime
        return timeFromTimestamp.equals(localTime);
    }

    public static boolean timeRangesOverlap(Timestamp A_Start, Timestamp A_End, Timestamp B_Start, Timestamp B_End) {
        if (B_End == null) {
            // If B_End is null, check if B_Start falls within A's range
            return B_Start != null && B_Start.after(A_Start) && B_Start.before(A_End);
        }

        // Regular checks if B_End is not null
        if (B_Start.after(A_Start) && B_Start.before(A_End)) return true; // B start is within A's range
        if (B_End.after(A_Start) && B_End.before(A_End)) return true; // B end is within A's range
        return A_Start.before(B_End) && A_End.after(B_Start); // Check for overlap
    }

    public static void validateFechas(LocalDate fechaDesde, LocalDate fechaHasta){
        if (fechaDesde != null) {
            if(DateTimeUtil.isFuture(fechaDesde)) throw new InvalidDataException("La fecha DESDE no puede ser superior a hoy");
        }
        if (fechaHasta != null) {
            if(DateTimeUtil.isFuture(fechaHasta)) throw new InvalidDataException("La fecha HASTA no puede ser superior a hoy");
        }
        if(fechaDesde !=null && fechaHasta !=null && fechaDesde.isAfter(fechaHasta)) throw new InvalidDataException("Le fecha DESDE no puede ser posterior a la fecha HASTA");
    }

    public static double calculateHoursDifference(Timestamp startTime, Timestamp endTime) {
        Instant startInstant = startTime.toInstant();
        Instant endInstant = endTime.toInstant();

        Duration duration = Duration.between(startInstant, endInstant);

        return duration.toMinutes() / 60.0; // Convert to hours with decimal
    }

    public static void areDatesWithinSixMonths(LocalDate date1, LocalDate date2) {
        long monthsBetween = ChronoUnit.MONTHS.between(date1, date2);
        if(Math.abs(monthsBetween) >6) throw new InvalidDataException("No se pueden seleccionar fechas con un rango mayor a 6 meses");
    }

}
