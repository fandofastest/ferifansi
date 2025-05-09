"use client";

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import Pagination from "@/components/tables/Pagination";
import spkService from '@/services/spkService';
import { formatDate } from '@/utils/dateHelper';
import type { SPK as SPKType } from '@/services/spkService'; // Import the service's SPK type
import SPKModal from "@/components/modals/SPKModal"; // Import the SPK Modal
import ViewSPKModal from "@/components/modals/ViewSPKModal"; // Add this import
import DeleteSPKModal from "@/components/modals/DeleteSPKModal";
import { formatRupiah } from "@/utils/formatUtils";
import ActivateSPKModal from "@/components/modals/ActivateSPKModal";
import Button from "@/components/ui/button/Button";
import Link from 'next/link';

// Update to use the imported type instead of redefining it
interface SPK extends SPKType {
    // You can add additional properties here if needed
}

export default function SPKPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [spks, setSpks] = useState<SPK[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false); // Add this state
    const [selectedSPK, setSelectedSPK] = useState<SPK | null>(null); // Add this state
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 10;

    const fetchSPKs = async () => {
        try {
            setLoading(true);
            const response = await spkService.getAll();
            setSpks(response);
        } catch (error) {
            console.error('Error fetching SPKs:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleActivateDraftSPK = async (spk: SPK) => {
        try {
            setLoading(true);
            await spkService.updateStatus(spk._id, 'active');
            await fetchSPKs(); // Refresh the list
        } catch (error) {
            console.error('Error activating SPK:', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchSPKs();
    }, []);

    // Get current items for the page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSPKs = spks.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(spks.length / itemsPerPage);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [spkToDelete, setSpkToDelete] = useState<SPK | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const confirmCancelSPK = async () => {
        if (!spkToDelete) return;

        try {
            setIsDeleting(true);
            // Update SPK status to 'cancelled' using the new updateStatus method
            await spkService.updateStatus(spkToDelete._id, 'cancelled');

            // Refresh the SPKs list
            await fetchSPKs();

            setIsDeleteModalOpen(false);
            setSpkToDelete(null);
        } catch (error) {
            console.error('Error cancelling SPK:', error);
        } finally {
            setIsDeleting(false);
        }
    };
    // Add this function to handle cancel
    const handleCancelSPK = (spk: SPK) => {
        setSpkToDelete(spk);
        setIsDeleteModalOpen(true);
    };
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
    const [newlyCreatedSPK, setNewlyCreatedSPK] = useState<SPK | null>(null);

    const handleSPKCreated = (spk: SPK) => {
        setNewlyCreatedSPK(spk);
        setIsActivateModalOpen(true);
    };

    const handleActivateSPK = async () => {
        if (!newlyCreatedSPK) return;

        try {
            setLoading(true);
            await spkService.updateStatus(newlyCreatedSPK._id, 'active');
            await fetchSPKs();
            setIsActivateModalOpen(false);
            setNewlyCreatedSPK(null);
        } catch (error) {
            console.error('Error activating SPK:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSkipActivation = () => {
        setIsActivateModalOpen(false);
        setNewlyCreatedSPK(null);
        fetchSPKs();
    };
    const handleViewSPK = (spk: SPK) => {
        setSelectedSPK(spk);
        setIsViewModalOpen(true);
    };

    return (
        <div>
            <div className="rounded-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">

                <div className="flex justify-between items-center mb-6">
                    <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        SPK Management
                    </div>
                    <div className="space-x-2">
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Create New SPK
                        </Button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="max-w-full overflow-x-auto">
                        <div className="min-w-[800px]">
                            <Table>
                                <TableHeader className="border-b border-gray-200 dark:border-gray-700">
                                    <TableRow>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300 text-start text-theme-xs">
                                            SPK Number
                                        </TableCell>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            Project Title
                                        </TableCell>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            Location
                                        </TableCell>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            Duration
                                        </TableCell>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            Status
                                        </TableCell>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            Total Amount
                                        </TableCell>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            Items
                                        </TableCell>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {loading ? (
                                        <TableRow>
                                            <TableCell className="px-5 py-10 text-center">
                                                <span className="flex justify-center">
                                                    Loading...
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ) : currentSPKs.length > 0 ? (
                                        currentSPKs.map((spk) => (
                                            <TableRow key={spk._id}>
                                                <TableCell className="px-5 py-4 text-gray-700 dark:text-gray-300">
                                                    <div className="font-medium">{spk.spkNo}</div>
                                                    <div className="text-xs text-gray-500">{formatDate(spk.createdAt)}</div>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400">
                                                    <div>{spk.spkTitle}</div>
                                                    <div className="text-xs mt-1">
                                                        <span className="text-gray-500">{formatDate(spk.projectStartDate)}</span>
                                                        <span className="mx-1">-</span>
                                                        <span className="text-gray-500">{formatDate(spk.projectEndDate)}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400">
                                                    <div className="font-medium">{spk.location?.name || 'No Location'}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {spk.location ? `${spk.location.latitude}°, ${spk.location.longitude}°` : ''}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400">
                                                    <div className="font-medium">{spk.projectDuration} days</div>
                                                </TableCell>
                                                <TableCell className="px-5 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${spk.status === 'completed'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                                                        : spk.status === 'active'
                                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                                                            : spk.status === 'cancelled'
                                                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                                                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100'
                                                        }`}>
                                                        {spk.status.charAt(0).toUpperCase() + spk.status.slice(1)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400 font-medium">
                                                    {formatRupiah(spk.totalAmount)}
                                                </TableCell>

                                                <TableCell className="px-5 py-4">
                                                    <div className="flex items-center space-x-1">
                                                        <span className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                            {spk.items.length}
                                                        </span>
                                                        <span className="text-gray-600 dark:text-gray-400">items</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400">
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => handleViewSPK(spk)}
                                                            className="px-2 py-1 text-xs"
                                                        >
                                                            View
                                                        </Button>
                                                        <Link href={`/spk-progress/${spk._id}`}>
                                                            <Button
                                                                variant="outline"
                                                                className="px-2 py-1 text-xs"
                                                            >
                                                                Detail Progress
                                                            </Button>
                                                        </Link>
                                                        {spk.status === 'draft' && (
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => handleActivateDraftSPK(spk)}
                                                                className="px-2 py-1 text-xs"
                                                            >
                                                                Activate
                                                            </Button>
                                                        )}
                                                        {spk.status !== 'cancelled' && spk.status !== 'draft' && (
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => handleCancelSPK(spk)}
                                                                className="px-2 py-1 text-xs"
                                                            >
                                                                Cancel
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell className="px-5 py-10 text-center text-gray-600 dark:text-gray-400">
                                                No SPKs found. Create your first SPK to get started.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    {spks.length > 0 && (
                        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            </div>



            {/* Add SPK Modal */}
            <SPKModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSuccess={handleSPKCreated}
            />
            <ViewSPKModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                spkData={selectedSPK}
            />
            <DeleteSPKModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                spkNo={spkToDelete?.spkNo || ''}
                onConfirm={confirmCancelSPK}
                isLoading={isDeleting}
            />

            {/* Replace the inline activation modal with the component */}
            <ActivateSPKModal
                isOpen={isActivateModalOpen}
                onClose={handleSkipActivation}
                spkNo={newlyCreatedSPK?.spkNo || ''}
                onConfirm={handleActivateSPK}
            />
        </div>
    );
}


