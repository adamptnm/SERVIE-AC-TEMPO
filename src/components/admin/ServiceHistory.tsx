import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Calendar,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ServiceHistoryProps {
  serviceHistory?: ServiceRecord[];
}

interface ServiceRecord {
  id: string;
  customerName: string;
  serviceDate: string;
  serviceType: string;
  status: "completed" | "cancelled" | "rescheduled";
  technician: string;
  amount: number;
  address: string;
}

const mockServiceHistory: ServiceRecord[] = [
  {
    id: "SRV-001",
    customerName: "Budi Santoso",
    serviceDate: "2023-05-15 10:00",
    serviceType: "Cuci AC 1 PK",
    status: "completed",
    technician: "Ahmad Teknisi",
    amount: 70000,
    address: "Jl. Merdeka No. 123, Jakarta Selatan",
  },
  {
    id: "SRV-002",
    customerName: "Siti Rahayu",
    serviceDate: "2023-05-16 13:30",
    serviceType: "Tambah Freon R22 1 PK",
    status: "completed",
    technician: "Budi Teknisi",
    amount: 175000,
    address: "Jl. Sudirman Blok A2, Jakarta Pusat",
  },
  {
    id: "SRV-003",
    customerName: "Dian Purnama",
    serviceDate: "2023-05-17 09:00",
    serviceType: "Bongkar Pasang AC 1.5 PK",
    status: "cancelled",
    technician: "Candra Teknisi",
    amount: 550000,
    address: "Apartemen Green View Tower B, Jakarta Barat",
  },
  {
    id: "SRV-004",
    customerName: "Rini Wijaya",
    serviceDate: "2023-05-18 15:00",
    serviceType: "Cuci AC Inverter 1 PK",
    status: "completed",
    technician: "Deni Teknisi",
    amount: 85000,
    address: "Jl. Kebon Jeruk No. 45, Jakarta Barat",
  },
  {
    id: "SRV-005",
    customerName: "Agus Hermawan",
    serviceDate: "2023-05-19 11:00",
    serviceType: "Isi Freon R32 2 PK",
    status: "rescheduled",
    technician: "Ahmad Teknisi",
    amount: 400000,
    address: "Perumahan Bumi Indah Blok C5, Tangerang",
  },
  {
    id: "SRV-006",
    customerName: "Maya Sari",
    serviceDate: "2023-05-20 14:00",
    serviceType: "Pengecekan AC",
    status: "completed",
    technician: "Budi Teknisi",
    amount: 75000,
    address: "Jl. Gatot Subroto No. 87, Jakarta Selatan",
  },
];

const ServiceHistory: React.FC<ServiceHistoryProps> = ({
  serviceHistory: propServiceHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [serviceHistory, setServiceHistory] = useState<ServiceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServiceHistory = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would fetch data from the API
        try {
          // Try to fetch from API (would be implemented in a real app)
          // const data = await getServiceHistory();
          // if (data && data.length > 0) {
          //   setServiceHistory(data);
          // } else {
          //   setServiceHistory(propServiceHistory || mockServiceHistory);
          // }

          // For demo, just use mock data
          setServiceHistory(propServiceHistory || mockServiceHistory);
        } catch (fetchError) {
          console.error("Error fetching service history:", fetchError);
          setServiceHistory(propServiceHistory || mockServiceHistory);
        }
      } catch (err) {
        console.error("Error in service history component:", err);
        setError("Failed to load service history");
        setServiceHistory(mockServiceHistory);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceHistory();
  }, [propServiceHistory]);

  // Filter service history based on search term and status
  const filteredHistory = serviceHistory.filter((record) => {
    const matchesSearch =
      record.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.serviceType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || record.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case "completed":
        return (
          <div className="flex items-center gap-1 text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-medium">
            <CheckCircle2 size={14} />
            <span>Selesai</span>
          </div>
        );
      case "cancelled":
        return (
          <div className="flex items-center gap-1 text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs font-medium">
            <XCircle size={14} />
            <span>Dibatalkan</span>
          </div>
        );
      case "rescheduled":
        return (
          <div className="flex items-center gap-1 text-amber-600 bg-amber-100 px-2 py-1 rounded-full text-xs font-medium">
            <Clock size={14} />
            <span>Dijadwalkan Ulang</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-lg text-gray-600">
            Loading service history...
          </span>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Riwayat Layanan
            </h2>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari berdasarkan nama atau ID"
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="Filter Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                    <SelectItem value="cancelled">Dibatalkan</SelectItem>
                    <SelectItem value="rescheduled">
                      Dijadwalkan Ulang
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="icon">
                  <Calendar className="h-4 w-4" />
                </Button>

                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableCaption>
                Daftar riwayat layanan AC Home Jaya Teknik
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Layanan</TableHead>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Tanggal & Waktu</TableHead>
                  <TableHead>Jenis Layanan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Teknisi</TableHead>
                  <TableHead>Biaya</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((record) => (
                    <TableRow
                      key={record.id}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <TableCell className="font-medium">{record.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{record.customerName}</span>
                          <span className="text-xs text-gray-500 truncate max-w-[200px]">
                            {record.address}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{record.serviceDate}</TableCell>
                      <TableCell>{record.serviceType}</TableCell>
                      <TableCell>
                        <StatusBadge status={record.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-100 p-1 rounded-full">
                            <User size={14} className="text-blue-600" />
                          </div>
                          {record.technician}
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(record.amount)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-gray-500"
                    >
                      Tidak ada data riwayat layanan yang ditemukan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">
                Menampilkan {indexOfFirstItem + 1}-
                {Math.min(indexOfLastItem, filteredHistory.length)} dari{" "}
                {filteredHistory.length} data
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ),
                )}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ServiceHistory;
