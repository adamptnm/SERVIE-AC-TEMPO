import { supabase } from "./supabase";
import { Database } from "@/types/supabase";

type Service = Database["public"]["Tables"]["services"]["Row"];
type Customer = Database["public"]["Tables"]["customers"]["Row"];
type Booking = Database["public"]["Tables"]["bookings"]["Row"];
type BookingService = Database["public"]["Tables"]["booking_services"]["Row"];
type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];

// Services API
export const getServices = async (): Promise<Service[]> => {
  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("category", { ascending: true });

    if (error) {
      console.error("Supabase error fetching services:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Exception fetching services:", err);
    return [];
  }
};

export const getServicesByCategory = async (
  category: string,
): Promise<Service[]> => {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("category", category);

  if (error) throw error;
  return data || [];
};

// Testimonials API
export const getTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_approved", true);

    if (error) {
      console.error("Supabase error fetching testimonials:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Exception fetching testimonials:", err);
    return [];
  }
};

// Booking API
export interface BookingFormData {
  name: string;
  phone: string;
  email?: string;
  address: string;
  residenceType: string;
  acType: string;
  acSize: string;
  serviceDate: string;
  serviceTime: string;
  knownIssues?: string;
  services: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
}

export const createBooking = async (
  bookingData: BookingFormData,
): Promise<string> => {
  // 1. Create customer
  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .insert({
      name: bookingData.name,
      phone: bookingData.phone,
      email: bookingData.email || null,
      address: bookingData.address,
      residence_type: bookingData.residenceType,
    })
    .select()
    .single();

  if (customerError) throw customerError;
  if (!customer) throw new Error("Failed to create customer");

  // 2. Create AC unit
  const { error: acUnitError } = await supabase.from("ac_units").insert({
    customer_id: customer.id,
    ac_type: bookingData.acType,
    ac_size: bookingData.acSize,
  });

  if (acUnitError) throw acUnitError;

  // 3. Calculate totals
  const subtotal = bookingData.services.reduce(
    (total, service) => total + service.price * service.quantity,
    0,
  );
  const taxAmount = Math.round(subtotal * 0.11); // 11% tax
  const totalAmount = subtotal + taxAmount;

  // 4. Create booking
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      customer_id: customer.id,
      service_date: bookingData.serviceDate,
      service_time: bookingData.serviceTime,
      status: "pending",
      total_amount: totalAmount,
      tax_amount: taxAmount,
      notes: bookingData.knownIssues || null,
    })
    .select()
    .single();

  if (bookingError) throw bookingError;
  if (!booking) throw new Error("Failed to create booking");

  // 5. Create booking services
  const bookingServices = bookingData.services.map((service) => ({
    booking_id: booking.id,
    service_id: service.id,
    quantity: service.quantity,
    price: service.price,
  }));

  const { error: bookingServicesError } = await supabase
    .from("booking_services")
    .insert(bookingServices);

  if (bookingServicesError) throw bookingServicesError;

  return booking.id;
};

// Admin API
export const getBookings = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      *,
      customer:customers(*),
      services:booking_services(*, service:services(*))
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getBookingById = async (id: string): Promise<any> => {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      *,
      customer:customers(*),
      services:booking_services(*, service:services(*))
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export const updateBookingStatus = async (
  id: string,
  status: string,
  technicianId?: string,
): Promise<void> => {
  const updateData: any = { status };
  if (technicianId) updateData.technician_id = technicianId;

  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", id);

  if (error) throw error;
};

export const getCustomers = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from("customers")
    .select(
      `
      *,
      ac_units(*),
      bookings(count)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createTestimonial = async (
  testimonialData: Omit<Testimonial, "id" | "created_at">,
): Promise<void> => {
  const { error } = await supabase.from("testimonials").insert(testimonialData);

  if (error) throw error;
};

// Auth API
export const loginAdmin = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const logoutAdmin = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data?.user;
};
