"use client";

import { useState, useEffect } from "react"; // 👈 Import useEffect
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ipfsApi, postsApi } from "@/lib/api-client";
import { jwtDecode, JwtPayload } from "jwt-decode"; // 👈 Import jwtDecode and JwtPayload
import Cookies from 'js-cookie' // 👈 NEW: Import the Cookies library

// 1. Define the custom JWT payload structure for type safety
interface CustomJwtPayload extends JwtPayload {
  id: string;
  userId: string;
  email: string;
  NgoName: string;
  walletAddr: string; // The field to extract
}

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
  const [form, setForm] = useState({
    Title: "",
    Type: "",
    Description: "",
    Location: "",
    NeedAmount: "",
    WalletAddr: "", // This will be pre-filled from the JWT
  });
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ==========================================================
  // 2. NEW LOGIC: Decode JWT and pre-populate WalletAddr
  // ==========================================================
useEffect(() => {
    // Only attempt to decode and set the address if the modal is opening
    if (isOpen) {
      // 💡 CHANGE HERE: Use Cookies.get() to retrieve the token
      const token = Cookies.get("accessToken"); 

      if (token) {
        try {
          const decoded = jwtDecode<CustomJwtPayload>(token); 
          
          setForm(prev => ({ 
            ...prev, 
            WalletAddr: decoded.walletAddr, // Set the wallet address from the token
          }));
        } catch (error) {
          console.error("Failed to decode JWT or token is invalid:", error);
          // If the token is invalid, you might clear it here: Cookies.remove("accessToken");
        }
      }
    }
  }, [isOpen]);
  // ==========================================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (
      !form.Title ||
      !form.Description ||
      !form.NeedAmount ||
      !form.WalletAddr
    ) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      let imgCid = "";

      // If image selected → upload to IPFS first
      if (image) {
        const ipfsRes = await ipfsApi.upload(image);
        console.log(ipfsRes);
        imgCid = ipfsRes.cid || ipfsRes.IpfsHash || ipfsRes.path || "";
      }

      // Now send full post data to backend
      const res = await postsApi.create({
        ...form,
        ImgCid: imgCid,
      });

      console.log("Post created:", res);
      alert("Task created successfully!");
      onClose();
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Something went wrong while creating the task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            name="Title"
            placeholder="Task Title"
            value={form.Title}
            onChange={handleChange}
          />
          <Input
            name="Type"
            placeholder="Task Type"
            value={form.Type}
            onChange={handleChange}
          />
          <Textarea
            name="Description"
            placeholder="Task Description"
            value={form.Description}
            onChange={handleChange}
          />
          <Input
            name="Location"
            placeholder="Location"
            value={form.Location}
            onChange={handleChange}
          />
          <Input
            name="NeedAmount"
            placeholder="Needed Amount (₹)"
            type="number"
            value={form.NeedAmount}
            onChange={handleChange}
          />
          <Input
            name="WalletAddr"
            // 💡 CHANGE HERE: Use a descriptive placeholder
            placeholder={
              form.WalletAddr || "Loading Wallet Address from JWT..."
            }
            value={form.WalletAddr}
            readOnly
            className="bg-gray-100 cursor-not-allowed"
            onChange={handleChange}
          />

          {/* Upload image */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Upload Image (optional)
            </label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-3 rounded-md border border-border w-full object-cover max-h-60"
              />
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {loading ? "Creating..." : "Create Task"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
