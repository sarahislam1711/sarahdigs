import { useState } from "react";
import AdminLayout from "@/components/layout/admin-layout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Quote, GripVertical } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Testimonial } from "@shared/schema";

export default function AdminTestimonials() {
  const { toast } = useToast();
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    clientRole: "",
    clientCompany: "",
    clientImageUrl: "",
    quote: "",
    displayOrder: 0,
    isVisible: true,
  });

  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/admin/testimonials"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("POST", "/api/admin/testimonials", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Testimonial created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create testimonial", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      return await apiRequest("PUT", `/api/admin/testimonials/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      setIsDialogOpen(false);
      setEditingItem(null);
      resetForm();
      toast({ title: "Testimonial updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update testimonial", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/testimonials/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({ title: "Testimonial deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete testimonial", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      clientName: "",
      clientRole: "",
      clientCompany: "",
      clientImageUrl: "",
      quote: "",
      displayOrder: 0,
      isVisible: true,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const openEdit = (item: Testimonial) => {
    setEditingItem(item);
    setFormData({
      clientName: item.clientName,
      clientRole: item.clientRole || "",
      clientCompany: item.clientCompany || "",
      clientImageUrl: item.clientImageUrl || "",
      quote: item.quote,
      displayOrder: item.displayOrder || 0,
      isVisible: item.isVisible ?? true,
    });
    setIsDialogOpen(true);
  };

  const openCreate = () => {
    setEditingItem(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const sortedTestimonials = [...testimonials].sort((a, b) => 
    (a.displayOrder || 0) - (b.displayOrder || 0)
  );

  return (
    <AdminLayout title="Testimonials">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-400">
            Manage client testimonials displayed on the website.
          </p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreate} data-testid="button-add-testimonial">
                <Plus className="w-4 h-4 mr-2" />
                Add Testimonial
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1a1a1a] border-gray-800 max-w-xl">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingItem ? "Edit Testimonial" : "Add New Testimonial"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Client Name *</Label>
                    <Input
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Jane Doe"
                      required
                      data-testid="input-client-name"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Role/Title</Label>
                    <Input
                      value={formData.clientRole}
                      onChange={(e) => setFormData({ ...formData, clientRole: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="CEO"
                      data-testid="input-client-role"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Company</Label>
                    <Input
                      value={formData.clientCompany}
                      onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Acme Inc."
                      data-testid="input-client-company"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Display Order</Label>
                    <Input
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="0"
                      data-testid="input-display-order"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300">Profile Image URL</Label>
                  <Input
                    value={formData.clientImageUrl}
                    onChange={(e) => setFormData({ ...formData, clientImageUrl: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="https://..."
                    data-testid="input-client-image"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Quote *</Label>
                  <Textarea
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                    placeholder="What the client said about your services..."
                    required
                    data-testid="input-quote"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={formData.isVisible}
                    onCheckedChange={(checked) => setFormData({ ...formData, isVisible: checked })}
                    data-testid="switch-visible"
                  />
                  <Label className="text-gray-300">Visible on website</Label>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-save-testimonial"
                  >
                    {editingItem ? "Update" : "Create"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-gray-400">Loading...</div>
        ) : testimonials.length === 0 ? (
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Quote className="w-12 h-12 text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg mb-2">No testimonials yet</p>
              <p className="text-gray-500 text-sm mb-4">Add your first client testimonial to display on the website.</p>
              <Button onClick={openCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Add Testimonial
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {sortedTestimonials.map((testimonial) => (
              <Card 
                key={testimonial.id} 
                className={`bg-[#1a1a1a] border-gray-800 ${!testimonial.isVisible ? 'opacity-50' : ''}`}
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex items-start gap-3 text-gray-600">
                      <GripVertical className="w-5 h-5 mt-1" />
                      <span className="text-sm font-mono bg-gray-800 px-2 py-1 rounded">
                        #{testimonial.displayOrder || 0}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {testimonial.clientImageUrl ? (
                            <img 
                              src={testimonial.clientImageUrl} 
                              alt={testimonial.clientName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-[#4D00FF]/20 flex items-center justify-center">
                              <span className="text-[#4D00FF] font-bold text-lg">
                                {testimonial.clientName.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="text-white font-semibold">{testimonial.clientName}</p>
                            <p className="text-gray-400 text-sm">
                              {[testimonial.clientRole, testimonial.clientCompany].filter(Boolean).join(" at ")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!testimonial.isVisible && (
                            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">
                              Hidden
                            </span>
                          )}
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => openEdit(testimonial)}
                            data-testid={`button-edit-testimonial-${testimonial.id}`}
                          >
                            <Pencil className="w-4 h-4 text-gray-300" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this testimonial?")) {
                                deleteMutation.mutate(testimonial.id);
                              }
                            }}
                            data-testid={`button-delete-testimonial-${testimonial.id}`}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      <div className="relative pl-4 border-l-2 border-[#4D00FF]/30">
                        <Quote className="absolute -left-3 -top-1 w-5 h-5 text-[#4D00FF] bg-[#1a1a1a]" />
                        <p className="text-gray-300 italic leading-relaxed">
                          "{testimonial.quote}"
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}