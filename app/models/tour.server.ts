import { Daysheet, Venue, Hotel, Address, Contact, Guest, Schedule } from "@prisma/client";

import { prisma } from "~/db.server";

/*--- DAYSHEET ---*/

export function getDaysheet({ slug }: Pick<Daysheet, "slug">) {
    return prisma.daysheet.findFirst({
        where: { slug },
    });
}

export async function createDaysheet(slug: Daysheet["slug"], date: Daysheet["date"], venue: Daysheet["venueId"], hotel: Daysheet["hotelId"], guestsLimit: Daysheet["guestsLimit"], buyOut: Daysheet["buyOut"], buyOutAmount: Daysheet["buyOutAmount"], buyOutAlt: Daysheet["buyOutAlt"], mapIn: Daysheet["mapIn"], mapOut: Daysheet["mapOut"]) {
    return prisma.daysheet.create({
        data: {
            slug,
            date,
            venue: {
                connect: {
                    id: venue
                }
            },
            hotel: {
                connect: {
                    id: hotel
                }
            },
            guestsLimit,
            buyOut,
            buyOutAmount,
            buyOutAlt,
            mapIn,
            mapOut
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

export async function createVenue(slug: Venue["slug"], name: Venue["name"], address: Venue["addressId"]) {
    return prisma.venue.create({
        data: {
            slug,
            name,
            address: {
                connect: {
                    id: address
                }
            }
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
    return prisma.venue.findFirst({
        where: { slug },
    });
}

export async function createHotel(slug: Hotel["slug"], name: Hotel["name"], address: Hotel["addressId"]) {
    return prisma.hotel.create({
        data: {
            slug,
            name,
            address: {
                connect: {
                    id: address
                }
            }
        },
    });
}

export function deleteHotel({ slug }: Pick<Hotel, "slug">) {
    return prisma.hotel.deleteMany({
        where: { slug },
    });
}

/*--- ADDRESS ---*/

export function getAddress({ slug }: Pick<Address, "slug">) {
    return prisma.address.findFirst({
        where: { slug },
    });
}

export async function createAddress(slug: Address["slug"], name: Address["name"], street: Address["street"], city: Address["city"], state: Address["state"], zip: Address["zip"], phone: Address["phone"], email: Address["email"]) {
    return prisma.address.create({
        data: {
            slug,
            name,
            street,
            city,
            state,
            zip,
            phone,
            email

        }
    });
}

export function deleteAddress({ slug }: Pick<Address, "slug">) {
    return prisma.address.deleteMany({
        where: { slug },
    });
}

/*--- CONTACT ---*/

export function getContact({ slug }: Pick<Contact, "slug">) {
    return prisma.contact.findFirst({
        where: { slug },
    });
}

export async function createContact(slug: Contact["slug"], name: Contact["name"], phone: Contact["phone"], email: Contact["email"], venueId: Contact["venueId"], daysheetId: Contact["daysheetId"]) {
    return prisma.contact.create({
        data: {
            slug,
            name,
            phone,
            email,
            venue: {
                connect: {
                    id: venueId ?? ""
                },
            },
            daysheet: {
                connect: {
                    id: daysheetId ?? ""
                }
            },
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

export async function createGuest(slug: Guest["slug"], name: Guest["name"], party: Guest["party"], daysheetId: Guest["daysheetId"]) {
    return prisma.guest.create({
        data: {
            slug,
            name,
            party,
            daysheet: {
                connect: {
                    id: daysheetId
                }
            }

        },
    });
}

export function deleteGuest({ slug }: Pick<Guest, "slug">) {
    return prisma.guest.deleteMany({
        where: { slug },
    });
}

/*--- SCHEDULE ---*/

export function getSchedule({ slug }: Pick<Schedule, "slug">) {
    return prisma.schedule.findFirst({
        where: { slug },
    });
}

export async function createSchedule(slug: Schedule["slug"], name: Schedule["name"], timeFrom: Schedule["timeFrom"], timeTo: Schedule["timeTo"], daysheetId: Schedule["daysheetId"]) {
    return prisma.schedule.create({
        data: {
            slug,
            name,
            timeFrom,
            timeTo,
            daysheet: {
                connect: {
                    id: daysheetId
                }
            }

        },
    });
}

export function deleteSchedule({ slug }: Pick<Schedule, "slug">) {
    return prisma.schedule.deleteMany({
        where: { slug },
    });
}