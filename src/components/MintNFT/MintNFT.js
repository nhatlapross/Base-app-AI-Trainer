"use client"
import React, { useEffect } from 'react';
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingAnimation } from "@/components/MintNFT/loading-animation"
import { ConfettiEffect } from "@/components/MintNFT/confetti-effect"
import Image from 'next/image'
import { useAccount, useWriteContract } from 'wagmi'
import { abi } from '@/abi/abi'
import Link from 'next/link'

export default function MintNFTPage() {
  const [isMinting, setIsMinting] = useState(false)
  const [nftName, setNftName] = useState('')
  const [mintedNFT, setMintedNFT] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const { address } = useAccount();
  const { data: hash, writeContract } = useWriteContract()

  // Array of avatar image paths
  const avatarImages = [
    {url:'/avatar/bear1.png',link:"https://statutory-plum-seahorse.myfilebase.com/ipfs/QmcxerZCr21F1zN97NifdYfJjpNay8vpf17wkt9E2a3Ngo"},
    {url:'/avatar/bear2.png',link:"https://statutory-plum-seahorse.myfilebase.com/ipfs/QmNWTAK5M3GRx8R94NXsJA1n15GzkcrbmUA3t3gJyotNAw"},
    {url:'/avatar/buffalo1.png',link:"https://statutory-plum-seahorse.myfilebase.com/ipfs/QmPfxSoDiwQX3Kb6UyEahKdP3UnyqHB6bcgrDJrY61v67X"},
    {url:'/avatar/buffalo2.png',link:"https://statutory-plum-seahorse.myfilebase.com/ipfs/QmZ7C2jnE5T2WBRejhPExgitfwbQFpyVLo2zcXfamVpnbF"},
    {url:'/avatar/cat1.png',link:"https://statutory-plum-seahorse.myfilebase.com/ipfs/QmZiV2bBF5fkvSfuS7PQi17MYqgquW4JXHgJp8XkvH59G8"},
    {url:'/avatar/cat2.png',link:"https://statutory-plum-seahorse.myfilebase.com/ipfs/QmRfDWaT8DmrrP2Vu4AQZfG88tdnS9VZ9vcusCUU4H68qc"},
    {url:'/avatar/chicken1.png',link:"https://statutory-plum-seahorse.myfilebase.com/ipfs/QmYPZtv8KwiXu41oiXb7j6pi4mh8j95v7pb7rwLuNQPD2P"},
    {url:'/avatar/chicken2.png',link:"https://statutory-plum-seahorse.myfilebase.com/ipfs/QmPUZfbL7XUZwooC1BtfLdfmnbbShiBS1dASC4duzc5Y6E"},
    {url:'/avatar/pig1.png',link:"https://statutory-plum-seahorse.myfilebase.com/ipfs/QmNdouP39erhzRaEwy3qQf6yH6P8qQdezuZkdg2JLQjoyz"},
    {url:'/avatar/pig2.png',link:"https://statutory-plum-seahorse.myfilebase.com/ipfs/QmQybyAYpUHVjzTzAXJoJUm7MW7BdreDUims9Kmih2G4Lm"},
    {url:'/avatar/tiger1.png',link:"https://statutory-plum-seahorse.myfilebase.com/ipfs/QmbnW2fdYPSiRAGSNu8JBUCJHjmy5rxSALmFEVQMwNSAWU"},
    {url:'/avatar/tiger2.png',link:"https://statutory-plum-seahorse.myfilebase.com/ipfs/QmcW93pTwXTRwjnnGF62ybNZuZnkFvpDLy1A9PPkZBcJ8p"},
  ]

  const handleMint = async (e) => {
    e.preventDefault();
    setMintedNFT(null);
    setIsMinting(true);


    try {

      writeContract({
        abi: abi,
        address: process.env.NEXT_PUBLIC_WEFIT_NFT,
        functionName: 'mintNFT',
        args: [nftName, address]
      })
    } catch (error) {
      console.error('Minting failed:', error);
      setIsMinting(false);
    }

  };

  useEffect(() => {
    if (hash != null && isMinting) {
      // Select a random image
      const randomImage = avatarImages[Math.floor(Math.random() * avatarImages.length)];
      console.log(hash);
      setIsMinting(false);
      setMintedNFT(randomImage);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, hash);


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center p-2">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Mint Your NFT</CardTitle>
          <CardDescription>Enter a name for your new NFT and click mint!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleMint}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="nftName">NFT Name</Label>
                <Input
                  id="nftName"
                  placeholder="Enter NFT name"
                  value={nftName}
                  onChange={(e) => setNftName(e.target.value)}
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4">
          <Button
            type="submit"
            onClick={handleMint}
            disabled={isMinting || !nftName.trim()}
            className="w-full"
          >
            {isMinting ? (
              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoadingAnimation />
                <span className="ml-2">Minting...</span>
              </motion.div>
            ) : (
              'Mint NFT'
            )}
          </Button>
          <AnimatePresence>
            {mintedNFT && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center"
              >
                <h3 className="text-xl font-bold mb-2">Congratulations!</h3>
                <p className="mb-4">Your NFT "{nftName}" has been minted successfully!</p>
                <div className="relative w-48 h-48 mx-auto border-4 border-white rounded-lg overflow-hidden">
                  <Image
                    src={mintedNFT}
                    alt={`Minted NFT: ${nftName}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </motion.div>
            )}
            {
              hash != null && mintedNFT != null &&
              <div className="mt-4 flex justify-center">
                <Link
                  href={`https://kairos.kaiascan.io/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="mx-auto">
                    View in Explorer
                  </Button>
                </Link>
              </div>
            }
          </AnimatePresence>
        </CardFooter>
      </Card>
      {showConfetti && <ConfettiEffect />}
    </div>
  )
}