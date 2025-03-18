"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Download, Plus, Search } from "lucide-react";

const ViewNotes = () => {
  const { user } = useUser();
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [showNewOrgModal, setShowNewOrgModal] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user) {
      const userId = user.id;
      const savedNotes = JSON.parse(localStorage.getItem(`notes_${userId}`)) || [];
      const savedOrgs = JSON.parse(localStorage.getItem(`organizations_${userId}`)) || [];
      setNotes(savedNotes);
      setOrganizations(savedOrgs);
    }
  }, [user]);

  const handleDeleteOrganization = (e, orgId) => {
    e.stopPropagation();
    const updatedOrgs = organizations.filter((org) => org.id !== orgId);
    const updatedNotes = notes.filter((note) => note.orgId !== orgId);
    setOrganizations(updatedOrgs);
    setNotes(updatedNotes);
    localStorage.setItem(`organizations_${user.id}`, JSON.stringify(updatedOrgs));
    localStorage.setItem(`notes_${user.id}`, JSON.stringify(updatedNotes));
  };

  const handleCreateOrganization = () => {
    if (newOrgName.trim()) {
      const newOrg = { id: Date.now().toString(), name: newOrgName.trim() };
      const updatedOrgs = [...organizations, newOrg];
      setOrganizations(updatedOrgs);
      localStorage.setItem(`organizations_${user.id}`, JSON.stringify(updatedOrgs));
      setNewOrgName("");
      setShowNewOrgModal(false);
    }
  };

  const handleDownloadNote = (e, note) => {
    e.preventDefault();
    e.stopPropagation();
    
    const element = document.createElement("a");
    const file = new Blob([note.content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${note.title}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const filteredOrganizations = organizations.filter((org) =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 bg-black">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-white">My Collections</h1>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => router.push("/notes/take")}
        >
          <Pencil className="w-5 h-5" /> Write New
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search organizations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 pl-10 bg-gray-800 text-white border border-gray-700 rounded"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          className="p-4 bg-gray-900 border border-gray-800 shadow-xl flex items-center justify-center cursor-pointer hover:bg-gray-800 transition"
          onClick={() => setShowNewOrgModal(true)}
        >
          <CardContent className="flex flex-col items-center">
            <Plus className="w-8 h-8 text-white" />
            <p className="text-white mt-2">Add Collection</p>
          </CardContent>
        </Card>

        {filteredOrganizations.map((org) => {
          const orgNotes = notes.filter((note) => note.orgId === org.id);
          return (
            <Card key={org.id} className="p-4 bg-gray-900 border border-gray-800 shadow-xl">
              <CardHeader className="flex flex-row justify-between items-center border-b border-gray-800 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📁</span>
                  <CardTitle className="text-xl font-semibold text-white">{org.name}</CardTitle>
                </div>
                <span
                  className="text-gray-300 cursor-pointer hover:underline ml-auto"
                  onClick={(e) => handleDeleteOrganization(e, org.id)}
                >
                  Delete
                </span>
              </CardHeader>

              <CardContent>
                <p className="text-gray-400 mb-3">Total Entries: {orgNotes.length}</p>
                {orgNotes.length === 0 ? (
                  <p className="text-gray-600">No notes under this organization.</p>
                ) : (
                  <div className="space-y-2">
                    {orgNotes.map((note) => (
                      <div
                        key={note.id}
                        className="flex items-center gap-2 p-2 bg-gray-800 rounded hover:bg-gray-700 transition cursor-pointer justify-between"
                        onClick={() => router.push(`/notes/view/${note.id}`)}
                      >
                        <div className="flex items-center gap-2">
                          <span>📄</span>
                          <p className="text-gray-300">{note.title}</p>
                        </div>
                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                          <button
                            className="text-blue-500 focus:outline-none"
                            onClick={(e) => handleDownloadNote(e, note)}
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {showNewOrgModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-xl w-96 border border-gray-800" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4 text-white">Create New Organization</h2>
            <input
              type="text"
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              placeholder="Organization Name"
              className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setShowNewOrgModal(false)} 
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateOrganization} 
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewNotes;