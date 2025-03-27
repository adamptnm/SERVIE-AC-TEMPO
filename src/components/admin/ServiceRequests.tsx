import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";

interface ServiceRequest {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  serviceDate: string;
  serviceTime: string;
  acType: string;
  issues: string;
  services: {
    name: string;
    price: number;
  }[];
  status: "pending" | "approved" | "rejected";
  totalAmount: number;
  createdAt: string;
}

const ServiceRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null,
  );
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Mock data for service requests
  const mockRequests: ServiceRequest[] = [
    {
      id: "REQ-001",
      customerName: "Budi Santoso",
      phone: "+62812345678",
      address: "Jl. Sudirman No. 123, Jakarta",
      serviceDate: "2023-07-15",
      serviceTime: "10:00",
      acType: "Daikin 1.5 PK",
      issues: "AC tidak dingin dan mengeluarkan bunyi berisik",
      services: [
        { name: "Cuci AC 1.5 - 2 PK", price: 95000 },
        { name: "Tambah Freon R22 1,5 - 2 PK", price: 250000 },
      ],
      status: "pending",
      totalAmount: 345000,
      createdAt: "2023-07-13T08:30:00",
    },
    {
      id: "REQ-002",
      customerName: "Siti Rahayu",
      phone: "+62856789012",
      address: "Apartemen Green View Tower A-12, Jakarta Selatan",
      serviceDate: "2023-07-16",
      serviceTime: "13:00",
      acType: "Panasonic 1 PK",
      issues: "Remote tidak berfungsi dan AC bocor",
      services: [
        { name: "Cuci AC 0.5 - 1 PK", price: 70000 },
        { name: "Biaya Apartemen", price: 20000 },
      ],
      status: "approved",
      totalAmount: 90000,
      createdAt: "2023-07-13T10:15:00",
    },
    {
      id: "REQ-003",
      customerName: "Ahmad Hidayat",
      phone: "+62878901234",
      address: "Jl. Gatot Subroto No. 45, Jakarta",
      serviceDate: "2023-07-17",
      serviceTime: "09:00",
      acType: "Sharp 2 PK",
      issues: "AC perlu dibongkar dan dipasang di ruangan baru",
      services: [
        { name: "Bongkar Pasang 1,5 - 2 PK (3-5mtr pipa)", price: 550000 },
        { name: "Bobok Tembok /m/lobang", price: 50000 },
      ],
      status: "rejected",
      totalAmount: 600000,
      createdAt: "2023-07-14T09:45:00",
    },
    {
      id: "REQ-004",
      customerName: "Dewi Lestari",
      phone: "+62890123456",
      address: "Jl. Thamrin No. 88, Jakarta Pusat",
      serviceDate: "2023-07-18",
      serviceTime: "14:30",
      acType: "LG Inverter 1 PK",
      issues: "AC perlu service rutin dan tambah freon",
      services: [
        { name: "Cuci AC Inverter 0,5 - 2 PK", price: 85000 },
        { name: "Tambah Freon R32/R410 0,5 - 1 PK", price: 185000 },
      ],
      status: "pending",
      totalAmount: 270000,
      createdAt: "2023-07-14T14:20:00",
    },
  ];

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would fetch data from the API
        // For now, we'll use the mock data
        try {
          // Try to fetch from API (would be implemented in a real app)
          // const data = await getBookings();
          // if (data && data.length > 0) {
          //   setRequests(data);
          // } else {
          //   setRequests(mockRequests);
          // }

          // For demo, just use mock data
          setRequests(mockRequests);
        } catch (fetchError) {
          console.error("Error fetching bookings:", fetchError);
          setRequests(mockRequests);
        }
      } catch (err) {
        console.error("Error in service requests component:", err);
        setError("Failed to load service requests");
        setRequests(mockRequests);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Filter requests based on search term and status filter
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter ? request.status === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setViewDetailsOpen(true);
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      setIsUpdating(true);
      // In a real app, this would call an API to update the request status
      console.log(`Approving request ${requestId}`);

      // Update the local state
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === requestId ? { ...req, status: "approved" as const } : req,
        ),
      );

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error approving request:", error);
      alert("Failed to approve request. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRejectRequest = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setRejectDialogOpen(true);
  };

  const confirmReject = async () => {
    if (selectedRequest) {
      try {
        setIsUpdating(true);
        // In a real app, this would call an API to update the request status with the reason
        console.log(
          `Rejecting request ${selectedRequest.id} with reason: ${rejectReason}`,
        );

        // Update the local state
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req.id === selectedRequest.id
              ? { ...req, status: "rejected" as const }
              : req,
          ),
        );

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        setRejectDialogOpen(false);
        setRejectReason("");
      } catch (error) {
        console.error("Error rejecting request:", error);
        alert("Failed to reject request. Please try again.");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Menunggu</Badge>;
      case "approved":
        return <Badge variant="default">Disetujui</Badge>;
      case "rejected":
        return <Badge variant="destructive">Ditolak</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  return (
    <motion.div
      className="p-6 bg-white rounded-lg shadow-md w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold mb-6">Permintaan Layanan</h2>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-lg text-gray-600">
            Loading service requests...
          </span>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Cari berdasarkan nama atau ID"
                className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant={statusFilter === null ? "default" : "outline"}
                onClick={() => setStatusFilter(null)}
                className="flex items-center gap-2"
              >
                <Filter size={16} />
                Semua
              </Button>
              <Button
                variant={statusFilter === "pending" ? "default" : "outline"}
                onClick={() => setStatusFilter("pending")}
                className="flex items-center gap-2"
              >
                Menunggu
              </Button>
              <Button
                variant={statusFilter === "approved" ? "default" : "outline"}
                onClick={() => setStatusFilter("approved")}
                className="flex items-center gap-2"
              >
                Disetujui
              </Button>
              <Button
                variant={statusFilter === "rejected" ? "default" : "outline"}
                onClick={() => setStatusFilter("rejected")}
                className="flex items-center gap-2"
              >
                Ditolak
              </Button>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableCaption>Daftar permintaan layanan AC</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Tanggal Layanan</TableHead>
                  <TableHead>Layanan</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.id}
                      </TableCell>
                      <TableCell>{request.customerName}</TableCell>
                      <TableCell>
                        {request.serviceDate} {request.serviceTime}
                      </TableCell>
                      <TableCell>{request.services.length} layanan</TableCell>
                      <TableCell>
                        {formatCurrency(request.totalAmount)}
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(request)}
                          >
                            <Eye size={16} className="mr-1" />
                            Detail
                          </Button>

                          {request.status === "pending" && (
                            <>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleApproveRequest(request.id)}
                                disabled={isUpdating}
                              >
                                {isUpdating ? (
                                  <Loader2
                                    size={16}
                                    className="mr-1 animate-spin"
                                  />
                                ) : (
                                  <CheckCircle size={16} className="mr-1" />
                                )}
                                {isUpdating ? "Processing..." : "Setuju"}
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRejectRequest(request)}
                                disabled={isUpdating}
                              >
                                {isUpdating ? (
                                  <Loader2
                                    size={16}
                                    className="mr-1 animate-spin"
                                  />
                                ) : (
                                  <XCircle size={16} className="mr-1" />
                                )}
                                {isUpdating ? "Processing..." : "Tolak"}
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-6 text-gray-500"
                    >
                      Tidak ada permintaan layanan yang ditemukan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {/* View Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Detail Permintaan Layanan {selectedRequest?.id}
            </DialogTitle>
            <DialogDescription>
              Dibuat pada{" "}
              {new Date(selectedRequest?.createdAt || "").toLocaleString(
                "id-ID",
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Informasi Pelanggan
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User size={18} className="text-gray-500" />
                      <span>{selectedRequest.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={18} className="text-gray-500" />
                      <span>{selectedRequest.phone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin size={18} className="text-gray-500 mt-1" />
                      <span>{selectedRequest.address}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Jadwal Layanan</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar size={18} className="text-gray-500" />
                      <span>{selectedRequest.serviceDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-gray-500" />
                      <span>{selectedRequest.serviceTime}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Spesifikasi AC</h3>
                  <p>{selectedRequest.acType}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Masalah yang Dilaporkan
                  </h3>
                  <p>{selectedRequest.issues}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Layanan yang Diminta
                  </h3>
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Layanan</TableHead>
                          <TableHead className="text-right">Harga</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedRequest.services.map((service, index) => (
                          <TableRow key={index}>
                            <TableCell>{service.name}</TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(service.price)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell>Total</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(selectedRequest.totalAmount)}
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Status</h3>
                  <div className="mb-4">
                    {getStatusBadge(selectedRequest.status)}
                  </div>

                  {selectedRequest.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => {
                          setViewDetailsOpen(false);
                          handleApproveRequest(selectedRequest.id);
                        }}
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <Loader2 size={16} className="mr-2 animate-spin" />
                        ) : (
                          <CheckCircle size={16} className="mr-2" />
                        )}
                        {isUpdating ? "Processing..." : "Setujui Permintaan"}
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => {
                          setViewDetailsOpen(false);
                          handleRejectRequest(selectedRequest);
                        }}
                        disabled={isUpdating}
                      >
                        <XCircle size={16} className="mr-2" />
                        Tolak Permintaan
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tolak Permintaan Layanan</DialogTitle>
            <DialogDescription>
              Berikan alasan penolakan permintaan layanan ini. Alasan ini akan
              disampaikan kepada pelanggan.
            </DialogDescription>
          </DialogHeader>

          <Textarea
            placeholder="Masukkan alasan penolakan..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="min-h-[100px]"
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={confirmReject}
              disabled={!rejectReason.trim() || isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Konfirmasi Penolakan"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ServiceRequests;
