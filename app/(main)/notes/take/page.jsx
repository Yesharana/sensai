"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const TakeNotes = () => {
  const { user } = useUser();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [orgId, setOrgId] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const [newOrgName, setNewOrgName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showOrgDialog, setShowOrgDialog] = useState(false);

  useEffect(() => {
    if (user) {
      const userId = user.id;
      const savedOrgs = JSON.parse(localStorage.getItem(`organizations_${userId}`)) || [];
      setOrganizations(savedOrgs);
    }
  }, [user]);

  const handleSaveNote = () => {
    if (!title.trim() || !content.trim() || !orgId) return;

    setLoading(true);
    setTimeout(() => {
      if (user) {
        const userId = user.id;
        const savedNotes = JSON.parse(localStorage.getItem(`notes_${userId}`)) || [];

        const newNote = {
          id: Date.now().toString(),
          title,
          content,
          orgId,
        };

        const updatedNotes = [...savedNotes, newNote];
        localStorage.setItem(`notes_${userId}`, JSON.stringify(updatedNotes));

        setTitle("");
        setContent("");
        setOrgId("");
        setShowDialog(true);
      }
      setLoading(false);
    }, 1000);
  };

  const handleCreateOrganization = () => {
    if (!newOrgName.trim()) return;
    
    const newOrg = {
      id: Date.now().toString(),
      name: newOrgName,
    };

    const userId = user?.id;
    if (userId) {
      const savedOrgs = JSON.parse(localStorage.getItem(`organizations_${userId}`)) || [];
      const updatedOrgs = [...savedOrgs, newOrg];
      localStorage.setItem(`organizations_${userId}`, JSON.stringify(updatedOrgs));
      setOrganizations(updatedOrgs);
    }
    
    setOrgId(newOrg.id);
    setNewOrgName("");
    setShowOrgDialog(false);
  };

  return (
    <div className="min-h-screen p-6 relative">
      {/* Create Organization Button */}
      <div className="absolute top-4 right-4">
        <Button variant="outline" onClick={() => setShowOrgDialog(true)}>
          Create Organization ➕
        </Button>
      </div>

      <Card className="max-w-lg mx-auto mt-12">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Take Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-3"
          />

          <Textarea
            placeholder="Write your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mb-3"
          />

          <select
            className="w-full p-2 border rounded-md mb-3"
            value={orgId}
            onChange={(e) => setOrgId(e.target.value)}
          >
            <option value="">Select Organization</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
          
          <Button variant="outline" onClick={() => setShowOrgDialog(true)} className="mb-3 w-full">
            Create New Organization
          </Button>

          <Button onClick={handleSaveNote} disabled={loading} className="w-full">
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Save Note"}
          </Button>
        </CardContent>
      </Card>

      {/* View Notes Link */}
      <div className="text-center mt-4">
        <Link href="/notes/view">
          <Button variant="link">View Notes →</Button>
        </Link>
      </div>

      {/* Success Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="fixed bottom-4 right-4 p-4 border border-green-600">
          <DialogTitle className="text-lg font-bold text-green-600">Success</DialogTitle>
          <p className="text-green-500">Note saved successfully!</p>
        </DialogContent>
      </Dialog>

      {/* Create Organization Dialog */}
      <Dialog open={showOrgDialog} onOpenChange={setShowOrgDialog}>
        <DialogContent>
          <DialogTitle>Create New Organization</DialogTitle>
          <Input
            placeholder="Organization Name"
            value={newOrgName}
            onChange={(e) => setNewOrgName(e.target.value)}
            className="mb-3"
          />
          <Button onClick={handleCreateOrganization} className="w-full">Create</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TakeNotes;
