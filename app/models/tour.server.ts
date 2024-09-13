import { Daysheet, Venue, Hotel, Contact, Guest, Schedule } from "@prisma/client";

import { prisma } from "~/db.server";

/*--- DAYSHEET ---*/

export function getDaysheet({ slug }: Pick<Daysheet, "slug">) {
    return prisma.daysheet.findFirst({
        where: { slug },
        include: {
            venue: true, hotel: true, schedules: {orderBy: {timeFrom: "asc" }}
        }
    });
}

export async function createDaysheet(slug: Daysheet["slug"], date: Daysheet["date"], guestsLimit: Daysheet["guestsLimit"], buyOut: Daysheet["buyOut"], buyOutAmount: Daysheet["buyOutAmount"], buyOutAlt: Daysheet["buyOutAlt"], venue?: Daysheet["venueId"], hotel?: Daysheet["hotelId"],) {
    return prisma.daysheet.create({
        data: {
            slug,
            date,
            guestsLimit,
            buyOut,
            buyOutAmount,
            buyOutAlt,
            venue: venue ? {
                connect: {
                    slug: venue
                }
            } : undefined,
            hotel: hotel ? {
                connect: {
                    slug: hotel
                }
            } : undefined,
        },
    });
}

export function deleteDaysheet({ slug }: Pick<Daysheet, "slug">) {
    return prisma.daysheet.deleteMany({
        where: { slug },
    });
}

/*--- VENUE ---*/

export function getVenue({ slug }: Pick<Venue, "slug">) {
    return prisma.venue.findFirst({
        where: { slug },
    });
}

export async function createVenue(slug: Venue["slug"], name: Venue["name"], site: Venue["site"], street: Venue["street"], city: Venue["city"], state: Venue["state"], zip: Venue["zip"], phone: Venue["phone"], email: Venue["email"]) {
    return prisma.venue.create({
        data: {
            slug,
            name,
            site,
            street,
            city,
            state,
            zip,
            phone,
            email

        },
    });
}

export function deleteVenue({ slug }: Pick<Venue, "slug">) {
    return prisma.venue.deleteMany({
        where: { slug },
    });
}

/*--- HOTEL ---*/

export function getHotel({ slug }: Pick<Hotel, "slug">) {
    return prisma.hotel.findFirst({
        where: { slug },
    });
}

export async function createHotel(slug: Hotel["slug"], name: Hotel["name"], site: Hotel["site"], street: Venue["street"], city: Venue["city"], state: Venue["state"], zip: Venue["zip"], phone: Venue["phone"], email: Venue["email"]) {
    return prisma.hotel.create({
        data: {
            slug,
            name,
            site,
            street,
            city,
            state,
            zip,
            phone,
            email
        }
    });
}

export function deleteHotel({ slug }: Pick<Hotel, "slug">) {
    return prisma.hotel.deleteMany({
        where: { slug },
    });
}

/*--- CONTACT ---*/

export function getContact({ slug }: Pick<Contact, "slug">) {
    return prisma.contact.findFirst({
        where: { slug },
        include: {
            venue: true, daysheet: true
        }
    });
}

export async function createContact(slug: Contact["slug"], name: Contact["name"], role: Contact["role"], phone: Contact["phone"], email: Contact["email"], venue?: Contact["venueId"], daysheet?: Contact["daysheetId"]) {
    return prisma.contact.create({
        data: {
            slug,
            name,
            role,
            phone,
            email,
            venue: venue ? {
                connect: {
                    id: venue
                },
            } : undefined,
            daysheet: daysheet ? {
                connect: {
                    id: daysheet
                }
            } : undefined,
        }
    });
}

export function deleteContact({ slug }: Pick<Contact, "slug">) {
    return prisma.contact.deleteMany({
        where: { slug },
    });
}


/*--- GUEST ---*/

export function getGuest({ slug }: Pick<Guest, "slug">) {
    return prisma.guest.findFirst({
        where: { slug },
    });
}

export async function createGuest(slug: Guest["slug"], name: Guest["name"], party: Guest["party"], daysheet?: Guest["daysheetId"]) {
    return prisma.guest.create({
        data: {
            slug,
            name,
            party,
            daysheet: daysheet ? {
                connect: {
                    id: daysheet
                }
            } : undefined

        },
    });
}

export function deleteGuest({ slug }: Pick<Guest, "slug">) {
    return prisma.guest.deleteMany({
        where: { slug },
    });
}

/*--- SCHEDULE ---*/

export const alertTypes = ["None", "Info", "Success", "Warning", "Error", "Primary", "Secondary", "Accent"] as const;
export const alertArray = ["None", "Info", "Success", "Warning", "Error", "Primary", "Secondary", "Accent"];

export function getSchedule({ slug }: Pick<Schedule, "slug">) {
    return prisma.schedule.findFirst({
        where: { slug },
        include: { daysheet: true }
    });
}

export async function createSchedule(slug: Schedule["slug"], name: Schedule["name"], alert: Schedule["alert"], note: Schedule["note"], timeFrom: Schedule["timeFrom"], timeTo: Schedule["timeTo"], daysheet?: Schedule["daysheetId"]) {
    return prisma.schedule.create({
        data: {
            slug,
            name,
            alert,
            note,
            timeFrom,
            timeTo,
            daysheet: daysheet ? {
                connect: {
                    id: daysheet
                }
            } : undefined

        },
    });
}

export function deleteSchedule({ slug }: Pick<Schedule, "slug">) {
    return prisma.schedule.deleteMany({
        where: { slug },
    });
}