export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return new Intl.DateTimeFormat("es-ES", options).format(date);
};

export const formatDateTimeLOCAL = (date: Date | string): string => {
  let localDate: Date;

  if (typeof date === "string") {
    // Si es un string, extraer la fecha y fijar hora a mediodía
    const datePart = date.split("T")[0];
    localDate = new Date(`${datePart}T12:00:00`);
  } else {
    // Si ya es un objeto Date, crear una nueva instancia y fijar hora a mediodía
    localDate = new Date(date);
    localDate.setHours(12, 0, 0, 0);
  }

  // Opciones modificadas para mostrar solo la fecha (sin hora)
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  return new Intl.DateTimeFormat("es-ES", options).format(localDate);
};
