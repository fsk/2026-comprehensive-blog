import { useMemo, useState } from 'react';
import { Calendar, Clock3, CreditCard, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import { BookingCalendarService, getCurrentUser } from '../services/api';
import type { AvailabilitySlot } from '../services/api';

const toIsoLocal = (date: Date) => {
    const d = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return d.toISOString().slice(0, 16);
};

const Booking = () => {
    const user = getCurrentUser();
    const [from, setFrom] = useState(toIsoLocal(new Date()));
    const [to, setTo] = useState(toIsoLocal(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)));
    const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
    const [selectedSlotId, setSelectedSlotId] = useState('');
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        name: user?.fullName || '',
        email: '',
        title: '',
        description: ''
    });

    const selectedSlot = useMemo(
        () => slots.find((slot) => slot.id === selectedSlotId),
        [slots, selectedSlotId]
    );

    const fetchSlots = async () => {
        if (!from || !to) {
            toast.error('Lutfen tarih araligi secin.');
            return;
        }
        setLoadingSlots(true);
        try {
            const data = await BookingCalendarService.getAvailability(from, to);
            setSlots(data);
            if (data.length === 0) {
                toast('Bu aralikta uygun slot bulunamadi.');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSlotId) {
            toast.error('Lutfen bir saat secin.');
            return;
        }
        setSubmitting(true);
        try {
            const booking = await BookingCalendarService.createBooking({
                slotId: selectedSlotId,
                name: form.name,
                email: form.email,
                title: form.title,
                description: form.description
            });
            const checkout = await BookingCalendarService.createCheckout(booking.id);
            toast.success('Rezervasyon olusturuldu. Odeme ekranina yonlendiriliyorsunuz.');
            window.open(checkout.paymentUrl, '_blank', 'noopener,noreferrer');
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                        Randevu Olustur
                    </h1>
                    <p className="mt-4 text-slate-600 dark:text-slate-400">
                        Uygun tarih araligini sec, 30 dakikalik slotlardan birini belirle ve konunu gonder.
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 space-y-6">
                    <div className="grid md:grid-cols-3 gap-4 items-end">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Baslangic</label>
                            <input
                                type="datetime-local"
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-3 outline-none focus:ring-2 focus:ring-orange-300"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bitis</label>
                            <input
                                type="datetime-local"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-3 outline-none focus:ring-2 focus:ring-orange-300"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={fetchSlots}
                            disabled={loadingSlots}
                            className="h-[46px] rounded-xl bg-gradient-to-r from-[#EA580C] to-[#FBBF24] text-white font-bold hover:opacity-90 transition disabled:opacity-60"
                        >
                            {loadingSlots ? 'Yukleniyor...' : 'Uygun Saatleri Getir'}
                        </button>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-[#EA580C]" />
                            Uygun Slotlar
                        </h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {slots.map((slot) => (
                                <button
                                    key={slot.id}
                                    type="button"
                                    onClick={() => setSelectedSlotId(slot.id)}
                                    className={`text-left rounded-xl border p-3 transition ${selectedSlotId === slot.id
                                            ? 'border-[#EA580C] bg-orange-50 dark:bg-orange-500/10'
                                            : 'border-slate-200 dark:border-slate-700 hover:border-[#EA580C]/40'
                                        }`}
                                >
                                    <div className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                        <Clock3 className="w-4 h-4 text-[#EA580C]" />
                                        {new Date(slot.startAt).toLocaleString('tr-TR')}
                                    </div>
                                    <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">
                                        {new Date(slot.endAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <p className="text-xs mt-2 font-bold text-[#EA580C]">
                                        {slot.price} {slot.currency}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 space-y-5">
                    <h2 className="text-lg font-bold">Randevu Bilgileri</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <input
                            required
                            placeholder="Ad Soyad"
                            value={form.name}
                            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-300"
                        />
                        <input
                            type="email"
                            required
                            placeholder="E-posta"
                            value={form.email}
                            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-300"
                        />
                    </div>
                    <input
                        required
                        minLength={5}
                        maxLength={120}
                        placeholder="Baslik"
                        value={form.title}
                        onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-300"
                    />
                    <textarea
                        required
                        minLength={10}
                        maxLength={1000}
                        rows={5}
                        placeholder="Aciklama / Konu"
                        value={form.description}
                        onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                    />

                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-sm">
                        <p className="font-semibold mb-1">Secili Slot</p>
                        {selectedSlot ? (
                            <p className="text-slate-600 dark:text-slate-300">
                                {new Date(selectedSlot.startAt).toLocaleString('tr-TR')} -{' '}
                                {new Date(selectedSlot.endAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}{' '}
                                | <span className="font-bold text-[#EA580C]">{selectedSlot.price} {selectedSlot.currency}</span>
                            </p>
                        ) : (
                            <p className="text-slate-500">Henuz slot secilmedi.</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-xl py-4 bg-gradient-to-r from-[#EA580C] to-[#FBBF24] text-white font-black flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Isleniyor...
                            </>
                        ) : (
                            <>
                                <CreditCard className="w-5 h-5" />
                                Kredi Karti Ile Ode
                            </>
                        )}
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default Booking;
