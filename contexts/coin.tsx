import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react"
import { getCoinsTopGainers, getCoinsMostValuable, getCoinsNew, tradeCoin, getCoin as getZoraCoin, simulateBuy } from "@zoralabs/coins-sdk";
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
        tick: 1
    })

    const { tick, trending, topByMarketCap, trendingNext, topNext, newest, newestNext } = values

    const fetchTopGainers = async () => {

        const response = await getCoinsTopGainers({
            count: 10,        // Optional: number of coins per page
            after: undefined, // Optional: for pagination
        });

        const tokens = response.data?.exploreList?.edges?.map((edge: any) => edge.node);

        console.log(`Top Gainers (${tokens?.length || 0} coins):`);

        tokens?.forEach((coin: any, index: number) => {
            console.log("coin:", coin)
            const percentChange = coin.marketCapDelta24h
                ? `${parseFloat(coin.marketCapDelta24h).toFixed(2)}%`
                : "N/A";

            console.log(`${index + 1}. ${coin.name} (${coin.symbol})`);
            console.log(`   24h Change: ${percentChange}`);
            console.log(`   Market Cap: ${coin.marketCap}`);
            console.log(`   Volume 24h: ${coin.volume24h}`);
            console.log('-----------------------------------');
        });

        // For pagination
        if (response.data?.exploreList?.pageInfo?.endCursor) {
            console.log("Next page cursor:", response.data?.exploreList?.pageInfo?.endCursor);
        }

        return response;
    }

    // const tradeCoin = useCallback(async ({ direction, tokenAddress, amount }: any) => {

    //     const activeAddress = account && account?.address

    //     if (!activeAddress) {
    //         return 
    //     }

    //     const tradeParams = {
    //          direction,
    //         target: tokenAddress as Address,
    //         args: {
    //             recipient: activeAddress as Address,
    //             orderSize: "1000000000000000"
    //             // orderSize: parseEther(`${amount}`)
    //         }
    //     }

    //     // Create configuration for wagmi
    //     // const contractCallParams = tradeCoinCall(tradeParams);

    //     console.log("tradeParams: ", tradeParams)

    //     const result = await tradeCoin(tradeParams, walletClient, publicClient);

    //     console.log("result:", result)

    //     // const writeConfig = await simulateContract(wagmiConfig, contractCallParams)
    //     // const hash = await writeContract(wagmiConfig, writeConfig.request);

    //     // console.log("hash : ", hash)

    //     // const receipt = await waitForTransactionReceipt(wagmiConfig, {
    //     //     hash
    //     // })

    //     // console.log("receipt : ", receipt)

    //     // const tradeEvent: any = getTradeFromLogs(receipt, direction);

    //     // if (tradeEvent) {
    //     //     console.log(tradeEvent);
    //     //     // tradeEvent.coinsPurchased <-- buy
    //     //     // tradeEvent.amountPurchased <-- sell

    //     //     return {
    //     //         transactionHash: hash,
    //     //         amount: direction === "buy" ? formatEther(tradeEvent.coinsPurchased) : formatEther(tradeEvent.amountPurchased)
    //     //     }

    //     // } else {
    //     //     return undefined
    //     // }

    // }, [ account, publicClient, walletClient ])


    const getCoin = async (address: string) => {
        //       console.log("get coin....")
        //       const response = await getCoin({
        //   address
        // });

        //       console.log("get coin result", coin)

        // const coin = response.data?.zora20Token;

        // return coin
        return undefined
    }

    //   const getCoinPrice = useCallback(async (address: any) => { 

    //       const response = await getZoraCoin({
    //   address: address, 
    // });

    //       console.log("response : ", response)

    // const coin = response.data?.zora20Token;

    // console.log("coin: ", coin)

    // //       const simulation = await simulateBuy({
    // //   target: address,
    // //   requestedOrderSize: parseEther("0.001"),
    // //   publicClient,
    // // });

    // //       console.log("simulation: ", simulation)

    //       return 1 
    //   },[publicClient])      

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
            fetchTopGainers,
            trending,
            topByMarketCap,
            trendingNext,
            topNext,
            newest,
            newestNext,
            loadMore,
            getCoin
        }), [
        trending,
        topByMarketCap,
        trendingNext,
        topNext,
        newest,
        newestNext,
        loadMore
    ])

    return (
        <CoinContext.Provider value={coinContext}>
            {children}
        </CoinContext.Provider>
    )
}

export default Provider