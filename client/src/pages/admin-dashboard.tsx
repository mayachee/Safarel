import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Edit, Plus, ArrowLeft, LogOut } from "lucide-react";
import { Link } from "wouter";
import type { Overview, Value, Service, TeamMember, InsertOverview, InsertValue, InsertService, InsertTeamMember } from "@shared/schema";

export default function AdminDashboard() {
  const { toast } = useToast();
  const { logout, admin } = useAuth();
  const [editingItems, setEditingItems] = useState<Record<string, number | null>>({});

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast({ title: "Logged out successfully" });
      },
    });
  };

  // Queries
  const { data: overview, isLoading: overviewLoading } = useQuery<Overview>({
    queryKey: ["/api/overview"],
  });

  const { data: values = [], isLoading: valuesLoading } = useQuery<Value[]>({
    queryKey: ["/api/values"],
  });

  const { data: services = [], isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const { data: teamMembers = [], isLoading: teamLoading } = useQuery<TeamMember[]>({
    queryKey: ["/api/team"],
  });

  // Overview mutations
  const updateOverviewMutation = useMutation({
    mutationFn: async (data: InsertOverview) => {
      const response = await apiRequest("PUT", "/api/overview", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/overview"] });
      queryClient.refetchQueries({ queryKey: ["/api/overview"] });
      toast({ title: "Overview updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update overview", variant: "destructive" });
    },
  });

  // Value mutations
  const createValueMutation = useMutation({
    mutationFn: async (data: InsertValue) => {
      const response = await apiRequest("POST", "/api/values", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/values"] });
      queryClient.refetchQueries({ queryKey: ["/api/values"] });
      toast({ title: "Value added successfully" });
    },
  });

  const updateValueMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertValue> }) => {
      const response = await apiRequest("PUT", `/api/values/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/values"] });
      queryClient.refetchQueries({ queryKey: ["/api/values"] });
      toast({ title: "Value updated successfully" });
      setEditingItems(prev => ({ ...prev, value: null }));
    },
  });

  const deleteValueMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/values/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/values"] });
      queryClient.refetchQueries({ queryKey: ["/api/values"] });
      toast({ title: "Value deleted successfully" });
    },
  });

  // Service mutations
  const createServiceMutation = useMutation({
    mutationFn: async (data: InsertService) => {
      const response = await apiRequest("POST", "/api/services", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      queryClient.refetchQueries({ queryKey: ["/api/services"] });
      toast({ title: "Service added successfully" });
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertService> }) => {
      const response = await apiRequest("PUT", `/api/services/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      queryClient.refetchQueries({ queryKey: ["/api/services"] });
      toast({ title: "Service updated successfully" });
      setEditingItems(prev => ({ ...prev, service: null }));
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      queryClient.refetchQueries({ queryKey: ["/api/services"] });
      toast({ title: "Service deleted successfully" });
    },
  });

  // Team mutations
  const createTeamMemberMutation = useMutation({
    mutationFn: async (data: InsertTeamMember) => {
      const response = await apiRequest("POST", "/api/team", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team"] });
      queryClient.refetchQueries({ queryKey: ["/api/team"] });
      toast({ title: "Team member added successfully" });
    },
  });

  const updateTeamMemberMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertTeamMember> }) => {
      const response = await apiRequest("PUT", `/api/team/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team"] });
      queryClient.refetchQueries({ queryKey: ["/api/team"] });
      toast({ title: "Team member updated successfully" });
      setEditingItems(prev => ({ ...prev, team: null }));
    },
  });

  const deleteTeamMemberMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/team/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team"] });
      queryClient.refetchQueries({ queryKey: ["/api/team"] });
      toast({ title: "Team member deleted successfully" });
    },
  });

  const handleOverviewSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: InsertOverview = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
    };
    updateOverviewMutation.mutate(data);
  };

  const handleValueSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: InsertValue = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      icon: formData.get("icon") as string,
      order: values.length + 1,
    };
    createValueMutation.mutate(data);
    e.currentTarget.reset();
  };

  const handleServiceSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: InsertService = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      icon: formData.get("icon") as string,
      imageUrl: formData.get("imageUrl") as string || undefined,
      order: services.length + 1,
    };
    createServiceMutation.mutate(data);
    e.currentTarget.reset();
  };

  const handleTeamMemberSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: InsertTeamMember = {
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      description: formData.get("description") as string,
      imageUrl: formData.get("imageUrl") as string || undefined,
      order: teamMembers.length + 1,
    };
    createTeamMemberMutation.mutate(data);
    e.currentTarget.reset();
  };

  if (overviewLoading || valuesLoading || servicesLoading || teamLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome, {admin?.email}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Homepage
              </Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="values">Values</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Edit Overview Section</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleOverviewSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      defaultValue={overview?.title}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      rows={3}
                      defaultValue={overview?.description}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={updateOverviewMutation.isPending}
                  >
                    {updateOverviewMutation.isPending ? "Updating..." : "Update Overview"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="values">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleValueSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="value-title">Title</Label>
                        <Input id="value-title" name="title" required />
                      </div>
                      <div>
                        <Label htmlFor="value-icon">Icon Class</Label>
                        <Input id="value-icon" name="icon" placeholder="fas fa-shield-alt" required />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="value-description">Description</Label>
                      <Textarea id="value-description" name="description" rows={2} required />
                    </div>
                    <Button type="submit" disabled={createValueMutation.isPending}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Value
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {values.map((value) => (
                <Card key={value.id}>
                  <CardContent className="pt-6">
                    {editingItems.value === value.id ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          const data = {
                            title: formData.get("title") as string,
                            description: formData.get("description") as string,
                            icon: formData.get("icon") as string,
                          };
                          updateValueMutation.mutate({ id: value.id, data });
                        }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Title</Label>
                            <Input name="title" defaultValue={value.title} required />
                          </div>
                          <div>
                            <Label>Icon Class</Label>
                            <Input name="icon" defaultValue={value.icon} required />
                          </div>
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea name="description" defaultValue={value.description} rows={2} required />
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit" disabled={updateValueMutation.isPending}>
                            Save Changes
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setEditingItems(prev => ({ ...prev, value: null }))}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{value.title}</h3>
                          <p className="text-gray-600 mt-1">{value.description}</p>
                          <p className="text-sm text-gray-500 mt-2">Icon: {value.icon}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingItems(prev => ({ ...prev, value: value.id }))}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteValueMutation.mutate(value.id)}
                            disabled={deleteValueMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="services">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleServiceSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="service-title">Title</Label>
                        <Input id="service-title" name="title" required />
                      </div>
                      <div>
                        <Label htmlFor="service-icon">Icon Class</Label>
                        <Input id="service-icon" name="icon" placeholder="fas fa-truck" required />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="service-imageUrl">Image URL</Label>
                      <Input id="service-imageUrl" name="imageUrl" type="url" />
                    </div>
                    <div>
                      <Label htmlFor="service-description">Description</Label>
                      <Textarea id="service-description" name="description" rows={3} required />
                    </div>
                    <Button type="submit" disabled={createServiceMutation.isPending}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Service
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {services.map((service) => (
                <Card key={service.id}>
                  <CardContent className="pt-6">
                    {editingItems.service === service.id ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          const data = {
                            title: formData.get("title") as string,
                            description: formData.get("description") as string,
                            icon: formData.get("icon") as string,
                            imageUrl: formData.get("imageUrl") as string || undefined,
                          };
                          updateServiceMutation.mutate({ id: service.id, data });
                        }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Title</Label>
                            <Input name="title" defaultValue={service.title} required />
                          </div>
                          <div>
                            <Label>Icon Class</Label>
                            <Input name="icon" defaultValue={service.icon} required />
                          </div>
                        </div>
                        <div>
                          <Label>Image URL</Label>
                          <Input name="imageUrl" defaultValue={service.imageUrl || ""} type="url" />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea name="description" defaultValue={service.description} rows={3} required />
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit" disabled={updateServiceMutation.isPending}>
                            Save Changes
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setEditingItems(prev => ({ ...prev, service: null }))}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{service.title}</h3>
                          <p className="text-gray-600 mt-1">{service.description}</p>
                          <div className="flex gap-4 mt-2 text-sm text-gray-500">
                            <span>Icon: {service.icon}</span>
                            {service.imageUrl && <span>Image: ✓</span>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingItems(prev => ({ ...prev, service: service.id }))}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteServiceMutation.mutate(service.id)}
                            disabled={deleteServiceMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="team">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Team Member</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleTeamMemberSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="team-name">Name</Label>
                        <Input id="team-name" name="name" required />
                      </div>
                      <div>
                        <Label htmlFor="team-role">Role</Label>
                        <Input id="team-role" name="role" required />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="team-imageUrl">Image URL</Label>
                      <Input id="team-imageUrl" name="imageUrl" type="url" />
                    </div>
                    <div>
                      <Label htmlFor="team-description">Description</Label>
                      <Input id="team-description" name="description" required />
                    </div>
                    <Button type="submit" disabled={createTeamMemberMutation.isPending}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Team Member
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {teamMembers.map((member) => (
                <Card key={member.id}>
                  <CardContent className="pt-6">
                    {editingItems.team === member.id ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          const data = {
                            name: formData.get("name") as string,
                            role: formData.get("role") as string,
                            description: formData.get("description") as string,
                            imageUrl: formData.get("imageUrl") as string || undefined,
                          };
                          updateTeamMemberMutation.mutate({ id: member.id, data });
                        }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Name</Label>
                            <Input name="name" defaultValue={member.name} required />
                          </div>
                          <div>
                            <Label>Role</Label>
                            <Input name="role" defaultValue={member.role} required />
                          </div>
                        </div>
                        <div>
                          <Label>Image URL</Label>
                          <Input name="imageUrl" defaultValue={member.imageUrl || ""} type="url" />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Input name="description" defaultValue={member.description} required />
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit" disabled={updateTeamMemberMutation.isPending}>
                            Save Changes
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setEditingItems(prev => ({ ...prev, team: null }))}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                          {member.imageUrl && (
                            <img
                              src={member.imageUrl}
                              alt={member.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold text-lg">{member.name}</h3>
                            <p className="text-primary font-medium">{member.role}</p>
                            <p className="text-gray-600 text-sm">{member.description}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingItems(prev => ({ ...prev, team: member.id }))}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteTeamMemberMutation.mutate(member.id)}
                            disabled={deleteTeamMemberMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
