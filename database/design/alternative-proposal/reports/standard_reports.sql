-- Class capacity and confirmed bookings
SELECT c.class_id,c.class_name,t.display_name AS trainer,c.capacity,
       COUNT(CASE WHEN b.status='CONFIRMED' THEN 1 END) AS confirmed_bookings,
       c.capacity-COUNT(CASE WHEN b.status='CONFIRMED' THEN 1 END) AS spaces
FROM fitness_class c JOIN trainer t ON t.trainer_id=c.trainer_id
LEFT JOIN booking b ON b.class_id=c.class_id
GROUP BY c.class_id,c.class_name,t.display_name,c.capacity
ORDER BY c.class_name;

-- Attendance summary by class
SELECT c.class_id,c.class_name,COUNT(a.attendance_id) AS attendance_records,
       SUM(CASE WHEN a.attended_flag='Y' THEN 1 ELSE 0 END) AS attended
FROM fitness_class c JOIN booking b ON b.class_id=c.class_id
LEFT JOIN attendance a ON a.booking_id=b.booking_id
GROUP BY c.class_id,c.class_name ORDER BY c.class_name;

-- Simulated/payment status totals, not audited revenue
SELECT currency,status,COUNT(*) AS payment_count,SUM(amount) AS amount_total
FROM payment GROUP BY currency,status ORDER BY currency,status;

-- Restrict reports to staff/admin through API authorization on every request.
