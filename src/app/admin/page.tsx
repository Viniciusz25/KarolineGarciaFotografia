"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { LogOut, Upload, Trash2, Image as ImageIcon, Loader2, FolderPlus, Layers, Heart, Settings, Edit3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

type Album = {
  id: string;
  title: string;
  category: "social" | "pet";
  subcategory?: string | null;
  cover_url: string;
  created_at: string;
};

type Photo = {
  id: string;
  url: string;
  category: "social" | "pet";
  title: string | null;
  album_id: string | null;
  created_at: string;
};

type SiteSetting = {
  key: string;
  title: string;
  section: string;
  url: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<"photos" | "albums" | "settings">("photos");
  const [loading, setLoading] = useState(true);

  // Data States
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  
  // Upload States for Photos
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoCategory, setPhotoCategory] = useState<"social" | "pet">("social");
  const [photoTitle, setPhotoTitle] = useState("");
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<{current: number, total: number} | null>(null);
  
  // Selection State for Bulk Delete
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  // Upload States for Albums
  const [uploadingAlbum, setUploadingAlbum] = useState(false);
  const [albumFile, setAlbumFile] = useState<File | null>(null);
  const [albumCategory, setAlbumCategory] = useState<"social" | "pet">("social");
  const [albumSubcategory, setAlbumSubcategory] = useState<string>("casamentos");
  const [albumTitle, setAlbumTitle] = useState("");

  // Upload States for Settings
  const [uploadingSettingKey, setUploadingSettingKey] = useState<string | null>(null);

  useEffect(() => {
    if (albumCategory === "social") setAlbumSubcategory("casamentos");
    else setAlbumSubcategory("externo");
  }, [albumCategory]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        router.push("/admin/login");
      } else {
        fetchData();
      }
    };
    checkUser();
  }, [router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: pData, error: pError } = await supabase.from("photos").select("*").order("created_at", { ascending: false });
      if (pError) console.error("Error fetching photos:", pError);
      if (pData) setPhotos(pData);

      const { data: aData, error: aError } = await supabase.from("albums").select("*").order("created_at", { ascending: false });
      if (aError) console.error("Error fetching albums:", aError);
      if (aData) setAlbums(aData);
      
      const { data: sData, error: sError } = await supabase.from("site_settings").select("*");
      if (sError) console.error("Error fetching settings:", sError);
      if (sData) setSettings(sData);
    } catch (err) {
      console.error("Unexpected error in fetchData:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  // -----------------------------------------------------
  // UPLOAD DE SETTING (PERSONALIZAÇÃO)
  // -----------------------------------------------------
  const handleUploadSetting = async (key: string, file: File) => {
    if (!file) return;
    setUploadingSettingKey(key);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `setting-${key}-${Date.now()}.${fileExt}`;
      const filePath = `sistema/${fileName}`;

      const { error: uploadError } = await supabase.storage.from("fotos").upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("fotos").getPublicUrl(filePath);

      const { error: dbError } = await supabase.from("site_settings").update({ url: publicUrl }).eq("key", key);
      if (dbError) throw dbError;

      alert("Imagem atualizada com sucesso!");
      fetchData();
    } catch (error: any) {
      alert("Erro ao atualizar imagem: " + error.message);
    } finally {
      setUploadingSettingKey(null);
    }
  };

  // -----------------------------------------------------
  // UPLOAD DE ÁLBUM
  // -----------------------------------------------------
  const handleUploadAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumFile || !albumTitle) return;

    setUploadingAlbum(true);
    try {
      const fileExt = albumFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `capas/${albumCategory}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from("fotos").upload(filePath, albumFile);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("fotos").getPublicUrl(filePath);

      const { error: dbError } = await supabase.from("albums").insert([
        { 
          title: albumTitle, 
          category: albumCategory, 
          cover_url: publicUrl,
          subcategory: albumSubcategory 
        }
      ]);
      if (dbError) throw dbError;

      alert("Ensaio criado com sucesso!");
      setAlbumFile(null);
      setAlbumTitle("");
      fetchData();
    } catch (error: any) {
      alert("Erro ao criar ensaio: " + error.message);
    } finally {
      setUploadingAlbum(false);
    }
  };

  // -----------------------------------------------------
  // UPLOAD DE FOTOS
  // -----------------------------------------------------
  const handleUploadPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (photoFiles.length === 0) return;

    setUploadingPhoto(true);
    try {
      let targetCategory = photoCategory;
      if (selectedAlbumId !== "") {
        const album = albums.find(a => a.id === selectedAlbumId);
        if (album) targetCategory = album.category;
      }

      let successCount = 0;
      setUploadProgress({ current: 0, total: photoFiles.length });

      for (let i = 0; i < photoFiles.length; i++) {
        const file = photoFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${targetCategory}/${fileName}`;

        const { error: uploadError } = await supabase.storage.from("fotos").upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from("fotos").getPublicUrl(filePath);

        const { error: dbError } = await supabase.from("photos").insert([
          { 
            url: publicUrl, 
            category: targetCategory, 
            title: photoTitle || null,
            album_id: selectedAlbumId === "" ? null : selectedAlbumId 
          }
        ]);
        if (dbError) throw dbError;

        successCount++;
        setUploadProgress({ current: successCount, total: photoFiles.length });
      }

      setPhotoFiles([]);
      setPhotoTitle("");
      alert(`${successCount} foto(s) enviada(s) com sucesso!`);
      fetchData();
    } catch (error: any) {
      alert("Erro ao enviar foto(s): " + error.message);
    } finally {
      setUploadingPhoto(false);
      setUploadProgress(null);
    }
  };

  // -----------------------------------------------------
  // EXCLUSÃO
  // -----------------------------------------------------
  const handleDeletePhoto = async (photo: Photo) => {
    if (!window.confirm("Excluir esta foto?")) return;
    try {
      await supabase.from("photos").delete().eq("id", photo.id);
      const urlParts = photo.url.split("/fotos/");
      if (urlParts.length > 1) {
        await supabase.storage.from("fotos").remove([urlParts[1]]);
      }
      setPhotos(photos.filter(p => p.id !== photo.id));
      setSelectedPhotos(prev => prev.filter(id => id !== photo.id));
    } catch (error: any) {
      alert("Erro ao excluir: " + error.message);
    }
  };

  const handleBulkDeletePhotos = async () => {
    if (!window.confirm(`Excluir as ${selectedPhotos.length} fotos selecionadas?`)) return;
    try {
      setLoading(true);
      const photosToDelete = photos.filter(p => selectedPhotos.includes(p.id));
      await supabase.from("photos").delete().in("id", selectedPhotos);
      const pathsToDelete = photosToDelete.map(p => p.url.split("/fotos/")[1]).filter(path => !!path);
      
      if (pathsToDelete.length > 0) {
        await supabase.storage.from("fotos").remove(pathsToDelete);
      }
      setPhotos(photos.filter(p => !selectedPhotos.includes(p.id)));
      setSelectedPhotos([]);
    } catch (error: any) {
      alert("Erro ao excluir fotos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectPhoto = (id: string) => {
    setSelectedPhotos(prev => prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]);
  };

  const handleDeleteAlbum = async (album: Album) => {
    if (!window.confirm("Excluir ESTE ENSAIO e TODAS as fotos dentro dele? Essa ação não pode ser desfeita.")) return;
    try {
      await supabase.from("albums").delete().eq("id", album.id);
      const urlParts = album.cover_url.split("/fotos/");
      if (urlParts.length > 1) {
        await supabase.storage.from("fotos").remove([urlParts[1]]);
      }
      fetchData();
    } catch (error: any) {
      alert("Erro ao excluir ensaio: " + error.message);
    }
  };

  const groupedSettings = settings.reduce((acc, curr) => {
    if (!acc[curr.section]) acc[curr.section] = [];
    acc[curr.section].push(curr);
    return acc;
  }, {} as Record<string, SiteSetting[]>);

  return (
    <div className="min-h-screen bg-[#f4ede8] font-sans flex flex-col pb-24">
      {/* HEADER ESCURO */}
      <header className="bg-[#120f0e] border-b border-[#cba37b]/20 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border border-[#cba37b]/30 rounded-full flex items-center justify-center text-[#cba37b] font-serif text-xl rotate-[-10deg]">
            KG
          </div>
          <div>
            <h1 className="font-serif text-xl text-[#f4ede8]">Painel de Controle</h1>
            <p className="text-[9px] text-white/50 uppercase tracking-[0.2em] mt-1">Administração</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center text-[10px] uppercase tracking-widest font-medium text-white/70 hover:text-white border border-white/10 hover:bg-white/5 px-6 py-2.5 rounded transition-colors"
        >
          <LogOut className="w-3 h-3 mr-2" /> SAIR
        </button>
      </header>

      {/* Tabs Escuras */}
      <div className="bg-[#1a1715] border-b border-[#cba37b]/10 sticky top-[73px] z-40 shadow-xl shadow-black/5 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex space-x-8 min-w-max">
          <button
            onClick={() => setActiveTab("photos")}
            className={clsx(
              "py-4 font-medium transition-colors border-b-2 flex items-center text-[10px] uppercase tracking-widest whitespace-nowrap",
              activeTab === "photos" ? "border-[#cba37b] text-[#cba37b]" : "border-transparent text-white/40 hover:text-white/80"
            )}
          >
            <ImageIcon className="w-4 h-4 mr-2" /> Fotos Soltas & Galeria
          </button>
          <button
            onClick={() => setActiveTab("albums")}
            className={clsx(
              "py-4 font-medium transition-colors border-b-2 flex items-center text-[10px] uppercase tracking-widest whitespace-nowrap",
              activeTab === "albums" ? "border-[#cba37b] text-[#cba37b]" : "border-transparent text-white/40 hover:text-white/80"
            )}
          >
            <Layers className="w-4 h-4 mr-2" /> Gerenciar Ensaios (Álbuns)
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={clsx(
              "py-4 font-medium transition-colors border-b-2 flex items-center text-[10px] uppercase tracking-widest whitespace-nowrap",
              activeTab === "settings" ? "border-[#cba37b] text-[#cba37b]" : "border-transparent text-white/40 hover:text-white/80"
            )}
          >
            <Settings className="w-4 h-4 mr-2" /> Personalização do Site (Cms)
          </button>
        </div>
      </div>

      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8 text-[#2d2422]">
        
        {/* ============================================================================================== */}
        {/* TAB: SETTINGS */}
        {/* ============================================================================================== */}
        {activeTab === "settings" && (
          <section className="col-span-1 lg:col-span-3">
            <div className="bg-white p-6 md:p-10 rounded-xl shadow-lg border border-[#2d2422]/10 min-h-[500px]">
              <div className="max-w-3xl mb-10">
                <h2 className="font-serif text-3xl mb-2 text-[#2d2422]">Personalização do Site</h2>
                <p className="text-[#2d2422]/60 text-sm">Altere as fotos fixas ilustrativas do seu site. Clique sobre a imagem que deseja trocar para fazer o upload de uma nova. A mudança aparecerá na mesma hora no site.</p>
              </div>

              {loading ? (
                <div className="flex justify-center py-32">
                  <Loader2 className="w-8 h-8 animate-spin text-[#cba37b]" />
                </div>
              ) : Object.keys(groupedSettings).length === 0 ? (
                <div className="text-center py-20 text-[#2d2422]/40">
                  Nenhuma configuração encontrada no banco de dados.
                </div>
              ) : (
                <div className="space-y-12">
                  {Object.entries(groupedSettings).map(([section, sectionSettings]) => (
                    <div key={section}>
                      <h3 className="text-xl font-serif text-[#2d2422] mb-6 border-b border-[#2d2422]/10 pb-2">{section}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {sectionSettings.map(setting => (
                          <div key={setting.key} className="relative group flex flex-col">
                            <label className="block text-[10px] uppercase tracking-widest font-medium text-[#2d2422]/60 mb-2 truncate" title={setting.title}>
                              {setting.title}
                            </label>
                            
                            <div className="relative aspect-square md:aspect-[4/5] rounded-xl overflow-hidden bg-muted cursor-pointer shadow-sm border border-[#2d2422]/10 group-hover:border-[#cba37b] transition-all">
                              <img src={setting.url} alt={setting.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                              
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                {uploadingSettingKey === setting.key ? (
                                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                                ) : (
                                  <div className="bg-white/20 backdrop-blur-md text-white p-3 rounded-full">
                                    <Edit3 className="w-5 h-5" />
                                  </div>
                                )}
                              </div>
                              
                              <input 
                                type="file" 
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={uploadingSettingKey === setting.key}
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleUploadSetting(setting.key, e.target.files[0]);
                                  }
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ============================================================================================== */}
        {/* TAB: PHOTOS */}
        {/* ============================================================================================== */}
        {activeTab === "photos" && (
          <>
            <section className="lg:col-span-1">
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-[#2d2422]/10 sticky top-40">
                <h2 className="font-serif text-2xl mb-6 flex items-center text-[#2d2422]">
                  <Upload className="w-5 h-5 mr-3 text-[#cba37b]" /> Upload de Foto
                </h2>
                
                <form onSubmit={handleUploadPhoto} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-medium text-[#2d2422]/60 mb-2">Imagens (Envio em Massa)</label>
                    <div className="border border-dashed border-[#2d2422]/20 rounded p-6 text-center hover:bg-[#f2eee9] transition-colors cursor-pointer relative bg-[#f4ede8]/50">
                      <input 
                        type="file" 
                        accept="image/*" 
                        required
                        multiple
                        onChange={(e) => setPhotoFiles(Array.from(e.target.files || []))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {photoFiles.length > 0 ? (
                        <div className="text-[#cba37b] font-medium text-sm px-2">
                          {photoFiles.length} foto(s) selecionada(s)
                          <div className="text-[10px] text-[#2d2422]/50 font-normal truncate mt-1">
                            {photoFiles.map(f => f.name).join(", ")}
                          </div>
                        </div>
                      ) : (
                        <div className="text-[#2d2422]/50 text-sm flex flex-col items-center">
                          <ImageIcon className="w-6 h-6 mb-2 opacity-50" />
                          Clique para selecionar as fotos
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-medium text-[#2d2422]/60 mb-2">Vincular a qual Ensaio?</label>
                    <select 
                      value={selectedAlbumId}
                      onChange={(e) => setSelectedAlbumId(e.target.value)}
                      className="w-full px-4 py-3 bg-[#f4ede8] border border-[#2d2422]/10 rounded focus:bg-white focus:border-[#cba37b] outline-none text-sm"
                    >
                      <option value="">Sem vínculo (Fotos Soltas no Portfólio)</option>
                      {albums.map(a => (
                        <option key={a.id} value={a.id}>[{a.category.toUpperCase()}] {a.title}</option>
                      ))}
                    </select>
                  </div>

                  {selectedAlbumId === "" && (
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-medium text-[#2d2422]/60 mb-2">Categoria (para Fotos Soltas)</label>
                      <select 
                        value={photoCategory}
                        onChange={(e) => setPhotoCategory(e.target.value as "social" | "pet")}
                        className="w-full px-4 py-3 bg-[#f4ede8] border border-[#2d2422]/10 rounded focus:bg-white focus:border-[#cba37b] outline-none text-sm"
                      >
                        <option value="social">Social</option>
                        <option value="pet">Pet</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-medium text-[#2d2422]/60 mb-2">Título (Opcional - será aplicado a todas)</label>
                    <input 
                      type="text" 
                      value={photoTitle}
                      onChange={(e) => setPhotoTitle(e.target.value)}
                      placeholder="Ex: Praia (Deixe vazio se preferir)"
                      className="w-full px-4 py-3 bg-[#f4ede8] border border-[#2d2422]/10 rounded focus:bg-white focus:border-[#cba37b] outline-none text-sm placeholder:text-[#2d2422]/30"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={uploadingPhoto || photoFiles.length === 0}
                    className="w-full bg-[#0f0c0b] text-white py-4 rounded font-medium uppercase tracking-widest text-[10px] hover:bg-[#cba37b] hover:text-[#0f0c0b] transition-colors flex items-center justify-center disabled:opacity-50 mt-6"
                  >
                    {uploadingPhoto ? (
                      <span className="flex items-center">
                        <Loader2 className="w-4 h-4 animate-spin mr-2" /> 
                        Enviando {uploadProgress?.current} de {uploadProgress?.total}...
                      </span>
                    ) : "FAZER UPLOAD"}
                  </button>
                </form>
              </div>
            </section>

            <section className="lg:col-span-2">
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-[#2d2422]/10 min-h-[500px]">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="font-serif text-2xl text-[#2d2422]">Todas as Fotos</h2>
                  
                  {photos.length > 0 && (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedPhotos(selectedPhotos.length === photos.length ? [] : photos.map(p => p.id))}
                        className="text-[10px] font-medium uppercase tracking-widest text-[#2d2422]/60 hover:text-[#2d2422] border border-[#2d2422]/20 px-4 py-2 rounded transition-colors"
                      >
                        {selectedPhotos.length === photos.length ? "Desmarcar Tudo" : "Selecionar Tudo"}
                      </button>
                      
                      {selectedPhotos.length > 0 && (
                        <button 
                          onClick={handleBulkDeletePhotos}
                          className="text-[10px] font-medium uppercase tracking-widest bg-red-900/10 hover:bg-red-500 text-red-600 hover:text-white px-4 py-2 rounded transition-colors flex items-center shadow-sm"
                        >
                          <Trash2 className="w-3 h-3 mr-2" /> Excluir {selectedPhotos.length}
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                {loading ? (
                  <div className="flex justify-center py-32">
                    <Loader2 className="w-8 h-8 animate-spin text-[#cba37b]" />
                  </div>
                ) : photos.length === 0 ? (
                  <div className="text-center py-32 text-[#2d2422]/40">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    Nenhuma foto publicada ainda.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {photos.map((photo) => {
                      const isSelected = selectedPhotos.includes(photo.id);
                      return (
                        <motion.div 
                          key={photo.id} 
                          layout 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          className={clsx(
                            "group relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer border-2 transition-all duration-300",
                            isSelected ? "border-[#cba37b] scale-95" : "border-transparent"
                          )}
                          onClick={() => toggleSelectPhoto(photo.id)}
                        >
                          <img src={photo.url} className="w-full h-full object-cover" />
                          
                          <div className={clsx(
                            "absolute top-3 left-3 w-5 h-5 rounded flex items-center justify-center transition-colors z-20 shadow-sm",
                            isSelected ? "bg-[#cba37b] border-transparent" : "border border-white/50 bg-black/20"
                          )}>
                            {isSelected && <div className="w-2 h-2 bg-white rounded-sm" />}
                          </div>

                          <div className={clsx(
                            "absolute inset-0 transition-opacity flex flex-col justify-end p-4",
                            isSelected ? "bg-black/30 opacity-100" : "bg-black/60 opacity-0 group-hover:opacity-100"
                          )}>
                            <div className="flex justify-between items-end">
                              <div>
                                <span className="bg-[#cba37b] text-[#120f0e] text-[9px] uppercase tracking-widest px-2 py-1 rounded font-medium">
                                  {photo.album_id ? 'ENSAIO' : 'SOLTA'}
                                </span>
                                {photo.album_id && (
                                  <p className="text-white/80 text-[9px] uppercase tracking-widest mt-2 truncate">Vínculo: Sim</p>
                                )}
                              </div>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePhoto(photo);
                                }} 
                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition-colors shadow-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {/* ============================================================================================== */}
        {/* TAB: ALBUMS */}
        {/* ============================================================================================== */}
        {activeTab === "albums" && (
          <>
            <section className="lg:col-span-1">
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-[#2d2422]/10 sticky top-40">
                <h2 className="font-serif text-2xl mb-6 flex items-center text-[#2d2422]">
                  <FolderPlus className="w-5 h-5 mr-3 text-[#cba37b]" /> Criar Novo Ensaio
                </h2>
                
                <form onSubmit={handleUploadAlbum} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-medium text-[#2d2422]/60 mb-2">Título do Ensaio</label>
                    <input 
                      type="text" 
                      required
                      value={albumTitle}
                      onChange={(e) => setAlbumTitle(e.target.value)}
                      placeholder="Ex: Casamento João e Maria"
                      className="w-full px-4 py-3 bg-[#f4ede8] border border-[#2d2422]/10 rounded focus:bg-white focus:border-[#cba37b] outline-none text-sm placeholder:text-[#2d2422]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-medium text-[#2d2422]/60 mb-2">Categoria</label>
                    <select 
                      value={albumCategory}
                      onChange={(e) => setAlbumCategory(e.target.value as "social" | "pet")}
                      className="w-full px-4 py-3 bg-[#f4ede8] border border-[#2d2422]/10 rounded focus:bg-white focus:border-[#cba37b] outline-none text-sm"
                    >
                      <option value="social">Social</option>
                      <option value="pet">Pet</option>
                    </select>
                  </div>

                  {albumCategory === "social" && (
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-medium text-[#2d2422]/60 mb-2">Subcategoria (Qual pasta?)</label>
                      <select 
                        value={albumSubcategory}
                        onChange={(e) => setAlbumSubcategory(e.target.value)}
                        className="w-full px-4 py-3 bg-[#f4ede8] border border-[#2d2422]/10 rounded focus:bg-white focus:border-[#cba37b] outline-none text-sm"
                      >
                        <option value="casamentos">Casamentos</option>
                        <option value="debutantes">Debutantes</option>
                        <option value="gestantes">Gestantes</option>
                        <option value="familia">Família</option>
                        <option value="casais">Casais</option>
                        <option value="formaturas">Formaturas</option>
                        <option value="eventos">Eventos</option>
                      </select>
                    </div>
                  )}

                  {albumCategory === "pet" && (
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-medium text-[#2d2422]/60 mb-2">Subcategoria (Qual pasta?)</label>
                      <select 
                        value={albumSubcategory}
                        onChange={(e) => setAlbumSubcategory(e.target.value)}
                        className="w-full px-4 py-3 bg-[#f4ede8] border border-[#2d2422]/10 rounded focus:bg-white focus:border-[#cba37b] outline-none text-sm"
                      >
                        <option value="externo">Ensaio Externo</option>
                        <option value="estudio">Estúdio</option>
                        <option value="pet-e-familia">Pets e Família</option>
                        <option value="filhotes">Filhotes</option>
                        <option value="datas-especiais">Datas Especiais</option>
                        <option value="aniversarios-pet">Aniversários Pet</option>
                        <option value="gatos">Gatos</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-medium text-[#2d2422]/60 mb-2">Foto de Capa</label>
                    <div className="border border-dashed border-[#2d2422]/20 rounded p-6 text-center hover:bg-[#f2eee9] transition-colors cursor-pointer relative bg-[#f4ede8]/50">
                      <input 
                        type="file" 
                        accept="image/*" 
                        required
                        onChange={(e) => setAlbumFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {albumFile ? (
                        <div className="text-[#cba37b] font-medium text-sm truncate px-2">{albumFile.name}</div>
                      ) : (
                        <div className="text-[#2d2422]/50 text-sm flex flex-col items-center">
                          <ImageIcon className="w-6 h-6 mb-2 opacity-50" />
                          Clique para anexar a capa
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={uploadingAlbum || !albumFile || !albumTitle}
                    className="w-full bg-[#0f0c0b] text-white py-4 rounded font-medium uppercase tracking-widest text-[10px] hover:bg-[#cba37b] hover:text-[#0f0c0b] transition-colors flex items-center justify-center disabled:opacity-50 mt-6"
                  >
                    {uploadingAlbum ? <Loader2 className="w-4 h-4 animate-spin" /> : "CRIAR ENSAIO"}
                  </button>
                </form>
              </div>
            </section>

            <section className="lg:col-span-2">
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-[#2d2422]/10 min-h-[500px]">
                <h2 className="font-serif text-2xl mb-8 text-[#2d2422]">Ensaios Publicados</h2>
                
                {loading ? (
                  <div className="flex justify-center py-32">
                    <Loader2 className="w-8 h-8 animate-spin text-[#cba37b]" />
                  </div>
                ) : albums.length === 0 ? (
                  <div className="text-center py-32 text-[#2d2422]/40">
                    <FolderPlus className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    Nenhum ensaio criado ainda.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {albums.map((album) => (
                      <motion.div key={album.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-muted shadow-sm border border-black/5">
                        <img src={album.cover_url} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                          <span className="bg-[#cba37b] text-[#120f0e] text-[9px] uppercase tracking-widest px-2 py-1 rounded font-medium w-max mb-2">
                            {album.category} {album.subcategory ? `- ${album.subcategory}` : ''}
                          </span>
                          <h3 className="text-white font-serif text-2xl">{album.title}</h3>
                          
                          <button 
                            onClick={() => handleDeleteAlbum(album)}
                            className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            title="Excluir Ensaio Inteiro"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}

      </main>
    </div>
  );
}
