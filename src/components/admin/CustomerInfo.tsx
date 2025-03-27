import React, { useState, useEffect } from "react";
import {
  Search,
  Edit,
  Trash2,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  Loader2,
} from "lucide-react";
import { getCustomers } from "@/lib/api";
import { motion } from "framer-motion";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CustomerData {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  acType: string;
  lastService: string;
  totalSpent: number;
}

const CustomerInfo = ({
  customersData = undefined,
}: {
  customersData?: CustomerData[];
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(
    null,
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [customers, setCustomers] = useState<CustomerData[]>(
    customersData || mockCustomers,
  );
  const [isLoading, setIsLoading] = useState(!customersData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customersData) {
      setCustomers(customersData);
      return;
    }

    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        try {
          const data = await getCustomers();

          if (data && data.length > 0) {
            const mappedCustomers: CustomerData[] = data.map(
              (customer: any) => {
                // Calculate total spent from bookings
                const totalSpent =
                  customer.bookings?.reduce((total: number, booking: any) => {
                    return total + (booking.total_amount || 0);
                  }, 0) || 0;

                // Get AC type from the first AC unit
                const acType = customer.ac_units?.[0]?.ac_type || "Unknown";

                // Get last service date from the most recent booking
                let lastService = "Never";
                if (customer.bookings && customer.bookings.length > 0) {
                  const sortedBookings = [...customer.bookings].sort(
                    (a: any, b: any) => {
                      return (
                        new Date(b.service_date).getTime() -
                        new Date(a.service_date).getTime()
                      );
                    },
                  );
                  lastService = sortedBookings[0].service_date;
                }

                return {
                  id: customer.id,
                  name: customer.name,
                  phone: customer.phone,
                  email: customer.email || "",
                  address: customer.address,
                  acType: `${acType} ${customer.ac_units?.[0]?.ac_size || ""}`,
                  lastService,
                  totalSpent,
                };
              },
            );

            setCustomers(mappedCustomers);
          } else {
            setCustomers(mockCustomers);
          }
        } catch (fetchError) {
          console.error("Error fetching customers:", fetchError);
          setCustomers(mockCustomers);
        }
      } catch (err) {
        console.error("Error in customer info component:", err);
        setError("Failed to load customer information");
        setCustomers(mockCustomers);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, [customersData]);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-white rounded-lg shadow-sm"
    >
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-lg text-gray-600">
            Loading customer information...
          </span>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Customer Information
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="whitespace-nowrap">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Customer
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Customer</DialogTitle>
                  </DialogHeader>
                  <CustomerForm />
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(false)}>
                      Save Customer
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableCaption>List of all customers</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>AC Type</TableHead>
                  <TableHead>Last Service</TableHead>
                  <TableHead className="text-right">Total Spent</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        {customer.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="flex items-center text-sm">
                            <Phone className="mr-2 h-3 w-3" /> {customer.phone}
                          </span>
                          <span className="flex items-center text-sm text-gray-500">
                            <Mail className="mr-2 h-3 w-3" /> {customer.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        <span className="flex items-center text-sm">
                          <MapPin className="mr-2 h-3 w-3 flex-shrink-0" />
                          {customer.address}
                        </span>
                      </TableCell>
                      <TableCell>{customer.acType}</TableCell>
                      <TableCell>{customer.lastService}</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(customer.totalSpent)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog
                            open={
                              isEditDialogOpen &&
                              selectedCustomer?.id === customer.id
                            }
                            onOpenChange={(open) => {
                              setIsEditDialogOpen(open);
                              if (!open) setSelectedCustomer(null);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedCustomer(customer);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Customer</DialogTitle>
                              </DialogHeader>
                              <CustomerForm customer={selectedCustomer} />
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setIsEditDialogOpen(false)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => setIsEditDialogOpen(false)}
                                >
                                  Save Changes
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Dialog
                            open={
                              isDeleteDialogOpen &&
                              selectedCustomer?.id === customer.id
                            }
                            onOpenChange={(open) => {
                              setIsDeleteDialogOpen(open);
                              if (!open) setSelectedCustomer(null);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => {
                                  setSelectedCustomer(customer);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Customer</DialogTitle>
                              </DialogHeader>
                              <div className="py-4">
                                <p>
                                  Are you sure you want to delete{" "}
                                  {selectedCustomer?.name}? This action cannot
                                  be undone.
                                </p>
                              </div>
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setIsDeleteDialogOpen(false)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => setIsDeleteDialogOpen(false)}
                                >
                                  Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <p className="text-gray-500">No customers found</p>
                      {searchTerm && (
                        <Button
                          variant="link"
                          onClick={() => setSearchTerm("")}
                          className="mt-2"
                        >
                          Clear search
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </motion.div>
  );
};

const CustomerForm = ({ customer }: { customer?: CustomerData | null }) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Full Name
          </label>
          <Input
            id="name"
            defaultValue={customer?.name || ""}
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone Number
          </label>
          <Input
            id="phone"
            defaultValue={customer?.phone || ""}
            placeholder="+62 812 3456 7890"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email Address
        </label>
        <Input
          id="email"
          type="email"
          defaultValue={customer?.email || ""}
          placeholder="john@example.com"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="address" className="text-sm font-medium">
          Address
        </label>
        <Input
          id="address"
          defaultValue={customer?.address || ""}
          placeholder="Jl. Sudirman No. 123, Jakarta"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="acType" className="text-sm font-medium">
            AC Type
          </label>
          <Input
            id="acType"
            defaultValue={customer?.acType || ""}
            placeholder="Daikin 1.5 PK"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="lastService" className="text-sm font-medium">
            Last Service Date
          </label>
          <Input
            id="lastService"
            type="date"
            defaultValue={customer?.lastService || ""}
          />
        </div>
      </div>
    </div>
  );
};

// Mock data for demonstration
const mockCustomers: CustomerData[] = [
  {
    id: "1",
    name: "Budi Santoso",
    phone: "0812-3456-7890",
    email: "budi@example.com",
    address: "Jl. Sudirman No. 123, Jakarta Pusat",
    acType: "Daikin 1.5 PK",
    lastService: "2023-10-15",
    totalSpent: 750000,
  },
  {
    id: "2",
    name: "Siti Rahayu",
    phone: "0856-7890-1234",
    email: "siti@example.com",
    address: "Jl. Gatot Subroto No. 45, Jakarta Selatan",
    acType: "Panasonic 1 PK",
    lastService: "2023-11-20",
    totalSpent: 1250000,
  },
  {
    id: "3",
    name: "Ahmad Hidayat",
    phone: "0878-9012-3456",
    email: "ahmad@example.com",
    address: "Jl. Thamrin No. 67, Jakarta Pusat",
    acType: "Sharp 2 PK",
    lastService: "2023-09-05",
    totalSpent: 950000,
  },
  {
    id: "4",
    name: "Dewi Lestari",
    phone: "0813-5678-9012",
    email: "dewi@example.com",
    address: "Jl. Kuningan No. 89, Jakarta Selatan",
    acType: "LG 0.5 PK",
    lastService: "2023-12-10",
    totalSpent: 500000,
  },
  {
    id: "5",
    name: "Rudi Hartono",
    phone: "0857-1234-5678",
    email: "rudi@example.com",
    address: "Jl. Kebon Jeruk No. 12, Jakarta Barat",
    acType: "Samsung 1.5 PK",
    lastService: "2024-01-05",
    totalSpent: 1500000,
  },
];

export default CustomerInfo;
