import test from 'node:test';
import assert from 'node:assert/strict';
import { appointments } from '../src/data/appointments';
import { DEMO_DATE } from '../src/data/availability';
import {
  bookingHref,
  isBookableDate,
  shiftDate,
  slotsFor,
  validateBooking,
} from '../src/lib/schedule';
import { validatePatient } from '../src/lib/patient-validation';
const booking = { doctorId: 'sofia', specialtyId: 'cardio', date: DEMO_DATE, time: '10:00' };
test('occupied times cannot be reserved', () => {
  assert.equal(
    slotsFor('sofia', DEMO_DATE, appointments).find((s) => s.time === '09:00')?.available,
    false,
  );
  assert.ok(validateBooking({ ...booking, time: '09:00' }, appointments));
});
test('habitual days and full-day exceptions block availability', () => {
  assert.equal(slotsFor('sofia', '2026-10-07', []).length, 0);
  assert.equal(slotsFor('sofia', '2026-10-12', []).length, 0);
});
test('special hours replace the habitual range', () => {
  assert.deepEqual(
    slotsFor('sofia', '2026-10-15', []).map((s) => s.time),
    ['10:00', '10:30', '11:00', '11:30'],
  );
  assert.ok(validateBooking({ ...booking, date: '2026-10-15', time: '09:00' }, []));
});
test('incompatible and unknown professionals rejected', () => {
  assert.ok(validateBooking({ ...booking, specialtyId: 'derma' }, []));
  assert.ok(validateBooking({ ...booking, doctorId: 'unknown' }, []));
});
test('out-of-hours reservation rejected', () => {
  assert.ok(validateBooking({ ...booking, time: '14:00' }, []));
});
test('free slot accepted, then rejected after reservation', () => {
  assert.equal(validateBooking(booking, appointments), null);
  const reserved = [
    ...appointments,
    { id: 'new', doctorId: booking.doctorId, date: booking.date, time: booking.time },
  ];
  assert.ok(validateBooking(booking, reserved));
});
test('cancelled reservations release their time', () => {
  assert.equal(
    validateBooking(
      { ...booking, time: '09:00' },
      appointments.map((a) => ({ ...a, cancelled: true })),
    ),
    null,
  );
});
test('past dates and dates beyond the booking window rejected', () => {
  assert.equal(isBookableDate('2026-10-32'), false);
  assert.equal(isBookableDate('invalid'), false);
  assert.equal(isBookableDate('2026-10-05'), false);
  assert.equal(isBookableDate('2026-11-06'), false);
  assert.ok(validateBooking({ ...booking, date: '2026-10-05' }, []));
});
test('full date has no free times', () => {
  assert.equal(slotsFor('paula', '2026-10-14', appointments).filter((s) => s.available).length, 0);
});
test('date navigation crosses month and year boundaries', () => {
  assert.equal(shiftDate('2026-10-31', 1), '2026-11-01');
  assert.equal(shiftDate('2026-12-31', 1), '2027-01-01');
});
test('all personal fields are validated with Spanish messages', () => {
  assert.equal(
    Object.keys(
      validatePatient({ firstName: '', lastName: '', dni: '123', phone: '123', email: 'wrong' }),
    ).length,
    5,
  );
  assert.deepEqual(
    validatePatient({
      firstName: 'Laura',
      lastName: 'Demo',
      dni: '40999888',
      phone: '11 4000-0000',
      email: 'laura@example.com',
    }),
    {},
  );
});
test('CTA presets are encoded in one shared URL format', () => {
  assert.equal(
    bookingHref({ specialtyId: 'cardio', doctorId: 'sofia' }),
    '/turnos?especialidad=cardio&profesional=sofia',
  );
  assert.equal(bookingHref(), '/turnos');
});
