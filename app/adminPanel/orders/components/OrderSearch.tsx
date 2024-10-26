"use client";
import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import '@algolia/autocomplete-theme-classic';
import { useEffect } from "react";
import { algoliasearch } from "algoliasearch";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import {getOrder, setLoading} from "@/lib/orderSlice/orderSlice";

function OrderSearch() {
    // Initialize Algolia
    const ordersSearchClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY);
    const dispatch: AppDispatch = useDispatch();

    // Dispatch action to get order details
    const setOrder = (orderId: string) => {
        dispatch(setLoading(true));
        dispatch(getOrder({ orderId }));
    };

    useEffect(() => {
        // Create the autocomplete instance
        const searchInstance = autocomplete({
            container: '#autocomplete',
            placeholder: 'Search for orders...',
            openOnFocus: true,
            insights: true,
            getSources({ query }) {
                if (!query) {
                    return [];
                }
                return [
                    {
                        sourceId: 'orders',
                        getItems() {
                            return getAlgoliaResults({
                                searchClient: ordersSearchClient,
                                queries: [
                                    {
                                        indexName: 'orders_index',
                                        query,
                                        params: {
                                            hitsPerPage: 5,
                                        },
                                    },
                                ]
                            });
                        },
                        templates: {
                            item({ item, html, components }) {
                                return html`
                                    <div class="p-4 border-b border-gray-200 flex flex-col space-y-2 cursor-pointer" onclick="${() => setOrder(item.orderId)}">
                                        <p class="text-sm font-semibold text-gray-800">
                                            Order ID: ${components.Highlight({ hit: item, attribute: 'orderId' })}
                                        </p>
                                        <p class="text-sm text-gray-600">
                                            Customer Name: ${item.customer.name}
                                        </p>
                                        <p class="text-sm text-gray-600">
                                            Address: ${item.customer.address}
                                        </p>
                                        <p class="text-sm text-gray-600">
                                            Payment Method: ${components.Highlight({ hit: item, attribute: 'paymentMethod' })}
                                        </p>
                                        <p class="text-sm text-gray-600">
                                            Payment Status: ${components.Highlight({ hit: item, attribute: 'paymentStatus' })}
                                        </p>
                                    </div>
                                `;
                            },
                            noResults({ html }) {
                                return html`
                                    <div class="p-4 text-gray-500 text-center">
                                        No orders found
                                    </div>
                                `;
                            },
                        },
                    },
                ];
            },
        });
        // Cleanup function to remove the autocomplete instance on component unmount
        return () => {
            searchInstance.destroy();
        };
    }, [ordersSearchClient, dispatch]); // Added dependencies for useEffect

    return <div id="autocomplete"></div>;
}

export default OrderSearch;
