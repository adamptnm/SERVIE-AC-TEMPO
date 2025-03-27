import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  ClipboardList,
  History,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  DollarSign,
  Settings as SettingsIcon,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Sidebar from "@/components/admin/Sidebar";
import ServiceRequests from "@/components/admin/ServiceRequests";
import CustomerInfo from "@/components/admin/CustomerInfo";
import ServiceHistory from "@/components/admin/ServiceHistory";
import Settings from "@/components/admin/Settings";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for dashboard stats
  const stats = {
    totalBookings: 156,
    totalCustomers: 89,
    totalRevenue: 12500000,
    pendingRequests: 8,
    completedServices: 148,
    cancelledServices: 12,
    recentBookings: [
      {
        id: "REQ-007",
        customer: "Andi Wijaya",
        service: "Cuci AC 1 PK",
        date: "2023-07-20",
        amount: 70000,
      },
      {
        id: "REQ-006",
        customer: "Lina Susanti",
        service: "Tambah Freon R32",
        date: "2023-07-19",
        amount: 185000,
      },
      {
        id: "REQ-005",
        customer: "Hadi Pranoto",
        service: "Bongkar Pasang AC",
        date: "2023-07-18",
        amount: 350000,
      },
    ],
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard Admin</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="requests">Permintaan Layanan</TabsTrigger>
              <TabsTrigger value="customers">Informasi Pelanggan</TabsTrigger>
              <TabsTrigger value="history">Riwayat Layanan</TabsTrigger>
              <TabsTrigger value="settings">Pengaturan</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Pemesanan
                      </CardTitle>
                      <ClipboardList className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {stats.totalBookings}
                      </div>
                      <p className="text-xs text-green-500 flex items-center mt-1">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        +12% dari bulan lalu
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Pelanggan
                      </CardTitle>
                      <Users className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {stats.totalCustomers}
                      </div>
                      <p className="text-xs text-green-500 flex items-center mt-1">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        +5% dari bulan lalu
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Pendapatan
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(stats.totalRevenue)}
                      </div>
                      <p className="text-xs text-green-500 flex items-center mt-1">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        +18% dari bulan lalu
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        Permintaan Tertunda
                      </CardTitle>
                      <Calendar className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {stats.pendingRequests}
                      </div>
                      <p className="text-xs text-red-500 flex items-center mt-1">
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                        -3% dari bulan lalu
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <motion.div
                  className="lg:col-span-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Statistik Layanan</CardTitle>
                      <CardDescription>
                        Ringkasan layanan bulan ini
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] flex items-center justify-center">
                        <div className="flex items-center gap-8">
                          <div className="flex flex-col items-center">
                            <div className="text-3xl font-bold text-green-500">
                              {stats.completedServices}
                            </div>
                            <div className="text-sm text-gray-500">Selesai</div>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="text-3xl font-bold text-amber-500">
                              {stats.pendingRequests}
                            </div>
                            <div className="text-sm text-gray-500">
                              Tertunda
                            </div>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="text-3xl font-bold text-red-500">
                              {stats.cancelledServices}
                            </div>
                            <div className="text-sm text-gray-500">
                              Dibatalkan
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Pemesanan Terbaru</CardTitle>
                      <CardDescription>
                        Pemesanan yang baru masuk
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {stats.recentBookings.map((booking, index) => (
                          <div
                            key={booking.id}
                            className="flex items-center justify-between"
                          >
                            <div className="space-y-1">
                              <p className="text-sm font-medium">
                                {booking.customer}
                              </p>
                              <p className="text-xs text-gray-500">
                                {booking.service}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                {formatCurrency(booking.amount)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {booking.date}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="requests">
              <ServiceRequests />
            </TabsContent>

            <TabsContent value="customers">
              <CustomerInfo />
            </TabsContent>

            <TabsContent value="history">
              <ServiceHistory />
            </TabsContent>

            <TabsContent value="settings">
              <Settings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
