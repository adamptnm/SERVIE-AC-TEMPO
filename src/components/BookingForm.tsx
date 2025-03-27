import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, addHours } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Clock, Loader2 } from "lucide-react";
import { createBooking, BookingFormData } from "@/lib/api";
import { motion } from "framer-motion";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  address: z.string().min(5, { message: "Please enter your complete address" }),
  acType: z.string({ required_error: "Please select AC type" }),
  acSize: z.string({ required_error: "Please select AC size" }),
  date: z.date({ required_error: "Please select a date" }),
  time: z.string({ required_error: "Please select a time" }),
  knownIssues: z.string().optional(),
  residenceType: z.string({ required_error: "Please select residence type" }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the cancellation policy",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface BookingFormProps {
  onSubmit?: (data: FormValues) => void;
}

const BookingForm = ({ onSubmit = () => {} }: BookingFormProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Calculate minimum time (2 hours from now)
  const now = new Date();
  const minBookingTime = addHours(now, 2);

  // Generate available time slots (every 30 minutes from min time to 8 PM)
  const generateTimeSlots = () => {
    const slots = [];
    const startTime = new Date(minBookingTime);
    startTime.setMinutes(Math.ceil(startTime.getMinutes() / 30) * 30);
    startTime.setSeconds(0);
    startTime.setMilliseconds(0);

    const endTime = new Date(startTime);
    endTime.setHours(20, 0, 0, 0); // 8 PM

    let current = new Date(startTime);
    while (current <= endTime) {
      slots.push(format(current, "HH:mm"));
      current.setMinutes(current.getMinutes() + 30);
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      acType: "",
      acSize: "",
      knownIssues: "",
      residenceType: "",
      acceptTerms: false,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Format the booking data
      const bookingData: BookingFormData = {
        name: values.name,
        phone: values.phone,
        address: values.address,
        residenceType: values.residenceType,
        acType: values.acType,
        acSize: values.acSize,
        serviceDate: format(values.date, "yyyy-MM-dd"),
        serviceTime: values.time,
        knownIssues: values.knownIssues || "",
        // This would normally come from the cart, but for demo we'll use sample services
        services: [
          { id: "1", name: "Cuci AC 0.5 - 2 PK", price: 70000, quantity: 1 },
          {
            id: "2",
            name: "Tambah Freon R22 0,5 - 1 PK",
            price: 175000,
            quantity: 1,
          },
        ],
      };

      // Submit to Supabase
      const bookingId = await createBooking(bookingData);
      console.log("Booking created with ID:", bookingId);

      // Call the onSubmit prop with the values
      onSubmit(values);

      // Clear form after submission
      form.reset();
    } catch (error) {
      console.error("Error submitting booking:", error);
      setSubmitError("Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
        Book Your AC Service
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-semibold border-b pb-2">
                Personal Information
              </h3>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your complete address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="residenceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Residence Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select residence type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="office">Office</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Note: Additional fee of Rp 20,000 applies for apartments
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* AC Information */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-semibold border-b pb-2">
                AC Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="acType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>AC Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select AC type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="inverter">Inverter</SelectItem>
                          <SelectItem value="cassette">Cassette</SelectItem>
                          <SelectItem value="central">Central</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="acSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>AC Size</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select AC size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0.5pk">0.5 PK</SelectItem>
                          <SelectItem value="0.75pk">0.75 PK</SelectItem>
                          <SelectItem value="1pk">1 PK</SelectItem>
                          <SelectItem value="1.5pk">1.5 PK</SelectItem>
                          <SelectItem value="2pk">2 PK</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="knownIssues"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Known Issues (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe any known issues with your AC"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Providing details about the issues helps our technicians
                      prepare better
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Service Schedule */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-semibold border-b pb-2">
                Service Schedule
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Service Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={"w-full pl-3 text-left font-normal"}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Select a date for your service appointment
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Time</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeSlots.length > 0 ? (
                            timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-slots" disabled>
                              No available slots today
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Appointments must be at least 2 hours from now
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>I agree to the cancellation policy</FormLabel>
                      <FormDescription>
                        If you cancel the service at the location, a
                        cancellation fee of Rp 75,000 will be charged.
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {submitError && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
              {submitError}
            </div>
          )}

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex justify-center"
          >
            <Button
              type="submit"
              className="w-full md:w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Submit Booking"
              )}
            </Button>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
};

export default BookingForm;
