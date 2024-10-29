"use client";
import {autocomplete, getAlgoliaResults} from '@algolia/autocomplete-js';
import '@algolia/autocomplete-theme-classic';
import {useEffect} from "react";
import {algoliasearch} from "algoliasearch";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/lib/store";
import {Item} from "@/interfaces";
import {setItems, setLoading} from "@/lib/inventorySlice/inventorySlice";

function OrderSearch() {
    // Initialize Algolia
    // @ts-ignore
    const dispatch:AppDispatch = useDispatch();
    const inventorySearch = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY);
    const setItem = (item:Item) => {
        dispatch(setLoading(true))
        dispatch(setItems([item]));
    }
    useEffect(() => {
        // Create the autocomplete instance
        const searchInstance = autocomplete({
            container: '#autocomplete',
            placeholder: 'Search for items...',
            openOnFocus: true,
            insights: true,
            getSources({query}) {
                if (!query) {
                    return [];
                }
                return [
                    {
                        sourceId: 'inventory',
                        getItems() {
                            return getAlgoliaResults({
                                searchClient: inventorySearch,
                                queries: [
                                    {
                                        indexName: "inventory_index",
                                        query,
                                        params: {
                                            hitsPerPage: 5,
                                        },
                                    },
                                ]
                            });
                        },
                        templates: {
                            item({item, html, components}) {
                                return html`
                                    <div class="p-4 border-b border-gray-200 flex flex-col space-y-2 cursor-pointer"
                                         onclick="${() =>setItem(item)}">
                                        <p class="text-sm font-semibold uppercase text-gray-800">
                                            Item ID: ${components.Highlight({ hit: item, attribute: 'itemId' })}
                                        </p>
                                        <p class="text-sm text-gray-600 capitalize">
                                            Manufacturer: ${components.Highlight({hit: item, attribute: 'manufacturer'})}
                                        </p>
                                        <p class="text-sm capitalize text-gray-600">
                                            Brand: ${item.brand}
                                        </p>
                                        <p class="text-sm text-gray-600">
                                            Name: ${components.Highlight({hit: item, attribute: 'name'})}
                                        </p>
                                    </div>
                                `;
                            },
                            noResults({html}) {
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
    }, [inventorySearch]); // Added dependencies for useEffect

    return <div id="autocomplete"></div>;
}

export default OrderSearch;
