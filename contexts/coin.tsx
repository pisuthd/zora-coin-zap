import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react"
import { getProfileBalances, getCoinsTopGainers, getCoinsMostValuable, getCoinsNew, tradeCoin, getCoin as getZoraCoin, simulateBuy } from "@zoralabs/coins-sdk";
import { useWriteContract, useSimulateContract, useAccount } from 'wagmi'
import { parseEther, Address } from 'viem'

export const CoinContext = createContext({})

const Provider = ({ children }: any) => {

    const account = useAccount()
    // const { writeContract } = useWriteContract()
    // const publicClient = usePublicClient() 

    const [values, dispatch] = useReducer(
        (curVal: any, newVal: any) => ({ ...curVal, ...newVal }), {
        trending: [],
        trendingNext: undefined,
        topByMarketCap: [],
        topNext: undefined,
        newest: [],
        newestNext: undefined,
        tick: 1,
        myTokens: [],
        myTokensNext: undefined
    })

    const { tick, trending, topByMarketCap, trendingNext, topNext, newest, newestNext, myTokens, myTokensNext } = values

    const fetchMyTokens = useCallback(async (myAddress: any, after = undefined) => {

        const response = await getProfileBalances({
            identifier: myAddress,
            count: 10,
            after
        });

        const profile: any = response.data?.profile;

        let myNewTokens = after === undefined ? [] : myTokens
        let newCursor = undefined

        if (profile?.coinBalances && profile.coinBalances.edges.length > 0) {
            const tokens = profile.coinBalances.edges?.map((edge: any) => edge.node);
            myNewTokens = [...myNewTokens, ...tokens]
        }

        if (profile?.coinBalances?.pageInfo?.endCursor) {
            newCursor = profile.coinBalances?.pageInfo?.endCursor
        }

        console.log(myTokens, myTokensNext)

        dispatch({
            myTokens: myNewTokens,
            myTokensNext: newCursor
        })

    }, [myTokens, myTokensNext])


    const fetchCoins = async () => {

        let response = await getCoinsTopGainers({
            count: 5,
            after: undefined,
        });

        const tokens = response.data?.exploreList?.edges?.map((edge: any) => edge.node);

        let trending = []
        let trendingNext = undefined

        if (tokens) {
            trending = tokens
        }

        if (response.data?.exploreList?.pageInfo?.endCursor) {
            trendingNext = response.data?.exploreList?.pageInfo?.endCursor
        }

        let topByMarketCap = []
        let topNext = undefined

        try {
            response = await getCoinsMostValuable({
                count: 5,
                after: undefined,
            });

            if (response.data?.exploreList?.edges) {
                topByMarketCap = response.data?.exploreList?.edges.map((edge: any) => edge.node);
            }

            if (response.data?.exploreList?.pageInfo?.endCursor) {
                topNext = response.data?.exploreList?.pageInfo?.endCursor
            }
        } catch (e) {

        }


        let newest = []
        let newestNext = undefined

        try {
            response = await getCoinsNew({
                count: 5,
                after: undefined,
            });

            if (response.data?.exploreList?.edges) {
                newest = response.data?.exploreList?.edges.map((edge: any) => edge.node);
            }

            if (response.data?.exploreList?.pageInfo?.endCursor) {
                newestNext = response.data?.exploreList?.pageInfo?.endCursor
            }
        } catch (e) {

        }


        dispatch({
            trending,
            trendingNext,
            topByMarketCap,
            topNext,
            newest,
            newestNext
        })

    }

    const loadMore = useCallback(async (activeView: string) => {

        switch (activeView) {
            case "trending":
                if (trendingNext) {
                    const response = await getCoinsTopGainers({
                        count: 5,
                        after: trendingNext,
                    });
                    const tokens = response.data?.exploreList?.edges?.map((edge: any) => edge.node);

                    let newItems = []
                    let newCursor = undefined

                    if (tokens) {
                        newItems = tokens
                    }

                    if (response.data?.exploreList?.pageInfo?.endCursor) {
                        newCursor = response.data?.exploreList?.pageInfo?.endCursor
                    }

                    dispatch({
                        trending: [...trending, ...newItems],
                        trendingNext: newCursor
                    })
                }
                break;
            case "market-cap":
                if (topNext) {
                    let newItems = []
                    let newCursor = undefined

                    const response = await getCoinsMostValuable({
                        count: 5,
                        after: topNext,
                    });

                    if (response.data?.exploreList?.edges) {
                        newItems = response.data?.exploreList?.edges.map((edge: any) => edge.node);
                    }

                    if (response.data?.exploreList?.pageInfo?.endCursor) {
                        newCursor = response.data?.exploreList?.pageInfo?.endCursor
                    }
                    dispatch({
                        topByMarketCap: [...topByMarketCap, ...newItems],
                        topNext: newCursor
                    })
                }

                break;
            case "newest":
                if (newestNext) {
                    let newItems = []
                    let newCursor = undefined

                    const response = await getCoinsNew({
                        count: 5,
                        after: newestNext,
                    });

                    if (response.data?.exploreList?.edges) {
                        newItems = response.data?.exploreList?.edges.map((edge: any) => edge.node);
                    }

                    if (response.data?.exploreList?.pageInfo?.endCursor) {
                        newCursor = response.data?.exploreList?.pageInfo?.endCursor
                    }
                    dispatch({
                        newest: [...newest, ...newItems],
                        newestNext: newCursor
                    })
                }
                break;
        }

    }, [trendingNext, topNext, newestNext, topByMarketCap, trending, newest])

    const coinContext = useMemo(
        () => ({
            fetchCoins,
            trending,
            topByMarketCap,
            trendingNext,
            topNext,
            newest,
            newestNext,
            loadMore,
            fetchMyTokens,
            myTokens,
            myTokensNext
        }), [
        trending,
        topByMarketCap,
        trendingNext,
        topNext,
        newest,
        newestNext,
        loadMore,
        fetchMyTokens,
        myTokens,
        myTokensNext
    ])

    return (
        <CoinContext.Provider value={coinContext}>
            {children}
        </CoinContext.Provider>
    )
}

export default Provider