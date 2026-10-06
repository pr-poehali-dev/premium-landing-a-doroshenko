import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

const PHOTO_HERO = 'https://cdn.poehali.dev/projects/bb03cd52-a7e1-49a3-8dc8-9ec2c7948b7a/bucket/f8023fbe-5972-4d0a-9de8-975b411fa0fa.jpg';
const PHOTO_ABOUT_1 = 'https://cdn.poehali.dev/projects/bb03cd52-a7e1-49a3-8dc8-9ec2c7948b7a/bucket/9a18b6be-471b-434f-83ca-c4a47dd3ed78.png';
const PHOTO_ABOUT_2 = 'https://cdn.poehali.dev/projects/bb03cd52-a7e1-49a3-8dc8-9ec2c7948b7a/bucket/e3383e45-4b36-41f0-8304-8f1de0901248.png';
const LOGO = 'https://cdn.poehali.dev/projects/bb03cd52-a7e1-49a3-8dc8-9ec2c7948b7a/bucket/147040bb-39b2-46b1-af51-38358912e677.png';

type FormState = {
  name: string;
  company: string;
  phone: string;
  channel: string;
  email: string;
  time: string;
  city: string;
  interest: string;
};
const EMPTY_FORM: FormState = {
  name: '', company: '', phone: '', channel: '', email: '', time: '', city: '', interest: '',
};

const CHANNELS = [
  { value: 'call', label: 'Звонок', icon: 'Phone' },
  { value: 'telegram', label: 'Telegram', icon: 'Send' },
  { value: 'max', label: 'MAX', icon: 'MessageCircle' },
  { value: 'email', label: 'Email', icon: 'Mail' },
];

const TEAM_SIZES = [
  { value: 'lt5', label: 'Менее 5' },
  { value: '5-7', label: '5–7' },
  { value: '8-15', label: '8–15' },
  { value: '16+', label: '16 и больше' },
];

const TICKER = ['Галя закрывает месяц', 'Регламент превыше клиента', 'Скидка вместо позиции', 'Прайс вместо разговора', 'Оклад без результата', 'Клиент ушёл к конкуренту'];

const PRODUCT_POINTS = [
  { icon: 'Flame', text: 'Учим включать мозги, держать позицию и дожимать сделку, а не кидаться прайс-листами.' },
  { icon: 'Swords', text: 'Проверяем в бою, кто в отделе боец, а кто просиживает штаны за ваши деньги.' },
];

const RESULTS = [
  { n: '01', title: 'Диагноз по каждому сотруднику', text: 'Кто приносит прибыль, а кто имитирует бурную деятельность.' },
  { n: '02', title: 'Точки слива денег', text: 'Где именно в коммуникации с клиентами утекает выручка.' },
  { n: '03', title: 'Понимание причины', text: 'Почему до расчётного счёта доходят крохи.' },
];

const RULES = [
  { icon: 'Users', title: 'Для кого', text: 'Сфера B2B, отдел продаж от 5 человек. РОП или коммерческий директор на площадке — обязательно.' },
  { icon: 'Banknote', title: 'Стоимость', text: '9 000 ₽ за 5-часовой тест.' },
  { icon: 'FileText', title: 'Оплата', text: 'Строго по безналу. Для бухгалтерии — идеальный расход, на личную карту не принимаю.' },
  { icon: 'Unlink', title: 'Без кабалы', text: 'Никакого долгосрочного сопровождения. Отработали, показали правду-матку, разошлись.' },
];

const ABOUT_TAGS = ['B2B', 'Продукт', 'Коммерция', 'Переговоры'];

const DIPLOMAS = [
  { src: 'https://cdn.poehali.dev/projects/bb03cd52-a7e1-49a3-8dc8-9ec2c7948b7a/bucket/87bc895e-e2f9-49b0-8f94-802cd51e4289.jpg', caption: 'Диплом, 2025' },
  { src: 'https://cdn.poehali.dev/projects/bb03cd52-a7e1-49a3-8dc8-9ec2c7948b7a/bucket/790ccbdf-465d-4ecb-93cc-d817d18cdcb5.jpg', caption: 'Сертификат, 2013' },
];

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView(0.08);
  return (
    <div ref={ref} className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}
      style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

const CARD_STYLE = { background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.14)' };
const ALT_BG = { borderTop: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(180deg, #0A0A0A 0%, #111 100%)' };

function isFormValid(form: FormState) {
  return form.name.trim() !== '' && form.company.trim() !== '' && form.phone.trim() !== '';
}

async function sendLead(form: FormState, type: string) {
  try {
    const channelLabel = CHANNELS.find(c => c.value === form.channel)?.label || '—';
    const sizeLabel = TEAM_SIZES.find(i => i.value === form.interest)?.label || '—';
    const res = await fetch('https://functions.poehali.dev/fc323d06-bbf9-4e34-b478-9a1d63552d0d', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        phone: form.phone,
        company: form.company,
        city: form.city,
        message: `Канал связи: ${channelLabel}. Email: ${form.email || '—'}. Время связи: ${form.time || '—'}. Менеджеров в отделе: ${sizeLabel}.`,
        type,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function LeadFields({ form, setForm, wide }: { form: FormState; setForm: React.Dispatch<React.SetStateAction<FormState>>; wide?: boolean }) {
  const span = wide ? 'md:col-span-2' : '';
  return (
    <>
      <input className="input-dark rounded-sm px-4 py-3 text-sm w-full" placeholder="ФИО *" required
        value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
      <input className="input-dark rounded-sm px-4 py-3 text-sm w-full" placeholder="Компания *" required
        value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
      <input className="input-dark rounded-sm px-4 py-3 text-sm w-full" placeholder="Телефон *" required
        value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
      <input className="input-dark rounded-sm px-4 py-3 text-sm w-full" placeholder="Город"
        value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />

      <div className={span}>
        <p className="text-white/40 text-xs tracking-wide uppercase mb-2">Сколько менеджеров в отделе продаж</p>
        <div className="flex flex-wrap gap-2">
          {TEAM_SIZES.map(i => (
            <button key={i.value} type="button" onClick={() => setForm(p => ({ ...p, interest: i.value }))}
              className="px-3 py-2 rounded-sm text-xs transition-colors"
              style={{
                background: form.interest === i.value ? 'rgba(201,169,110,0.18)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${form.interest === i.value ? 'rgba(201,169,110,0.7)' : 'rgba(201,169,110,0.25)'}`,
                color: form.interest === i.value ? '#e8d5a3' : 'rgba(245,240,232,0.7)',
              }}>
              {i.label}
            </button>
          ))}
        </div>
      </div>

      <div className={span}>
        <p className="text-white/40 text-xs tracking-wide uppercase mb-2">Приоритетный канал связи</p>
        <div className="flex flex-wrap gap-2">
          {CHANNELS.map(c => (
            <button key={c.value} type="button" onClick={() => setForm(p => ({ ...p, channel: c.value }))}
              className="flex items-center gap-1.5 px-3 py-2 rounded-sm text-xs transition-colors"
              style={{
                background: form.channel === c.value ? 'rgba(201,169,110,0.18)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${form.channel === c.value ? 'rgba(201,169,110,0.7)' : 'rgba(201,169,110,0.25)'}`,
                color: form.channel === c.value ? '#e8d5a3' : 'rgba(245,240,232,0.7)',
              }}>
              <Icon name={c.icon} size={13} />
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {form.channel === 'email' && (
        <input className="input-dark rounded-sm px-4 py-3 text-sm w-full" placeholder="Email"
          type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
      )}

      <input className="input-dark rounded-sm px-4 py-3 text-sm w-full" placeholder="Удобное время для связи"
        value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} />
    </>
  );
}

function Modal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await sendLead(form, 'Рыночный тест · 9 000 ₽');
    setSent(true);
    setLoading(false);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto"
        style={{ background: '#0e0e0e', border: '1px solid rgba(201,169,110,0.35)', borderRadius: 2 }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">
          <Icon name="X" size={20} />
        </button>
        {sent ? (
          <div className="p-10 text-center">
            <div className="text-5xl mb-4">🤝</div>
            <p className="font-cormorant text-2xl gold-text mb-2">Заявка принята</p>
            <p className="text-white/60 font-golos text-sm">Андрей лично посмотрит заявку и напишет вам. Мест на тест всего 5</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-4">
            <h3 className="font-cormorant text-2xl text-off-white mb-1">
              Заявка на рыночный тест
            </h3>
            <p className="text-white/50 text-sm font-golos mb-2">
              Только B2B, отдел продаж от 5 человек. Оплата по безналу, 9 000 ₽
            </p>
            <LeadFields form={form} setForm={setForm} />
            <button type="submit" disabled={loading || !isFormValid(form)} className="btn-gold rounded py-3 text-sm mt-2 disabled:opacity-40">
              {loading ? 'Отправляем...' : 'Подать заявку'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await sendLead(form, 'bottom');
    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="text-center py-10">
        <div className="text-4xl mb-4">🤝</div>
        <p className="font-cormorant text-2xl gold-text mb-2">Заявка принята</p>
        <p className="text-white/50 text-sm">Андрей лично посмотрит заявку и напишет вам. Мест на тест всего 5</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
      <LeadFields form={form} setForm={setForm} wide />
      <div className="md:col-span-2">
        <button type="submit" disabled={loading || !isFormValid(form)}
          className="btn-gold rounded-sm py-4 px-8 text-sm tracking-wider uppercase disabled:opacity-40 w-full md:w-auto">
          {loading ? 'Отправляем...' : 'Подать заявку на тест · 9 000 ₽ по безналу'}
        </button>
      </div>
    </form>
  );
}

function SectionTitle({ eyebrow, children }: { eyebrow?: string; children: React.ReactNode }) {
  return (
    <div className="text-center mb-12">
      {eyebrow && <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">{eyebrow}</p>}
      <h2 className="font-cormorant text-3xl md:text-5xl text-off-white font-light leading-tight">{children}</h2>
      <div className="section-divider mt-6" />
    </div>
  );
}

export default function Index() {
  const [modalOpen, setModalOpen] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const hero = useInView(0.05);

  const openModal = () => setModalOpen(true);

  useEffect(() => {
    const interval = setInterval(() => setPhotoIdx(i => (i + 1) % 2), 5000);
    return () => clearInterval(interval);
  }, []);

  const aboutPhotos = [PHOTO_ABOUT_1, PHOTO_ABOUT_2];

  return (
    <div className="min-h-screen bg-obsidian text-off-white font-golos overflow-x-hidden">
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} />

      {lightbox && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 cursor-zoom-out"
          style={{ background: 'rgba(0,0,0,0.92)' }} onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white/60 hover:text-white" onClick={() => setLightbox(null)}>
            <Icon name="X" size={26} />
          </button>
          <img src={lightbox} alt="Документ об образовании" className="max-w-full max-h-[90vh] object-contain" />
        </div>
      )}

      {/* ШАПКА */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 py-4"
        style={{ background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(201,169,110,0.1)' }}>
        <div className="flex flex-col items-center gap-1 whitespace-nowrap">
          <img src={LOGO} alt="Бизнес-игры by Doroshenko" className="h-14 w-14 md:h-16 md:w-16 rounded-full object-cover" />
          <span className="font-cormorant text-lg md:text-xl tracking-widest uppercase gold-text hidden sm:inline">
            ДОРОШЕНКО
          </span>
        </div>
        <nav className="hidden lg:flex gap-6 text-xs text-white/40 tracking-widest uppercase">
          <a href="#test" className="hover:text-white transition-colors">Диагноз</a>
          <a href="#owner" className="hover:text-white transition-colors">Результат</a>
          <a href="#format" className="hover:text-white transition-colors">Условия</a>
          <a href="#about" className="hover:text-white transition-colors">Автор</a>
          <a href="#contact" className="hover:text-white transition-colors">Контакты</a>
        </nav>
        <button onClick={openModal}
          className="text-xs tracking-widest uppercase gold-text hover:opacity-70 transition-opacity border border-gold/30 px-4 py-2 hidden md:block">
          Подать заявку
        </button>
        <a href="tel:89206200034" className="text-sm gold-text hover:opacity-80 transition-opacity font-medium md:hidden">
          8 920 620-00-34
        </a>
      </header>

      {/* HERO */}
      <section ref={hero.ref} className="relative min-h-screen flex items-stretch overflow-hidden pt-16">
        <div className="relative z-10 flex flex-col justify-center px-6 md:px-16 lg:px-24 py-20 w-full md:w-1/2">
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(rgba(201,169,110,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.025) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
          <div className="relative z-10 max-w-xl">
            <p className={`inline-flex items-center gap-2 text-xs tracking-wide text-gold border border-gold/40 px-3 py-1.5 mb-8 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Icon name="MapPin" size={13} />
              Санкт-Петербург · Октябрь · Всего 5 компаний
            </p>

            <h1 className={`font-cormorant font-light leading-[1.08] mb-6 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ fontSize: 'clamp(1.9rem, 3.8vw, 3.3rem)', transitionDelay: '0.15s' }}>
              Хватит делать вид, что вы продаёте.{' '}
              <span className="gold-gradient">Ваши менеджеры спят, а деньги на расчётник не идут.</span>
            </h1>

            <p className={`text-white/70 text-[15px] md:text-base leading-relaxed mb-9 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '0.3s' }}>
              Трафик есть, бюджеты жгутся, но клиент уходит к конкуренту, потому что манагер на звонке забыл открыть рот и сдулся при первом «дорого».
            </p>

            <div className={`transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '0.45s' }}>
              <button onClick={openModal} className="btn-gold px-8 py-4 text-sm tracking-wider uppercase rounded-sm w-full sm:w-auto">
                Подать заявку на тест
                <span className="block text-[11px] tracking-wide normal-case opacity-80 mt-0.5">9 000 ₽ по безналу</span>
              </button>
            </div>
          </div>
        </div>

        <div className="hidden md:block absolute right-0 top-16 bottom-0 w-1/2">
          <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to right, #0A0A0A 0%, transparent 35%)' }} />
          <img src={PHOTO_HERO} alt="Андрей Дорошенко" className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.85) contrast(1.05)', objectPosition: 'top' }} />
          <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to top, #0A0A0A 0%, transparent 40%)' }} />
        </div>
      </section>

      {/* БЕГУЩАЯ СТРОКА */}
      <div className="overflow-hidden py-3 border-y" style={{ borderColor: 'rgba(201,169,110,0.2)', background: 'rgba(201,169,110,0.06)' }}>
        <div className="flex gap-10 whitespace-nowrap animate-ticker w-max">
          {[...TICKER, ...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="flex items-center gap-10 text-xs tracking-[0.25em] uppercase gold-text">
              {t}<Icon name="Skull" size={13} className="text-gold/60" />
            </span>
          ))}
        </div>
      </div>

      {/* ДИАГНОЗ */}
      <section id="test" className="py-24 px-6 md:px-16 lg:px-24" style={ALT_BG}>
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <SectionTitle eyebrow="Диагноз">
              Победа бухгалтерии<br /><span className="gold-text">над здравым смыслом</span>
            </SectionTitle>
            <p className="text-white/75 text-[15px] md:text-lg leading-relaxed mb-5">
              В девяноста процентах компаний никаких продаж давно нет. Есть <span className="gold-text">Галя, королева 1С</span>. Менеджер превратился в оператора ксерокса: его задача — завести номенклатуру, провести бумажку и отгрузить только тем, кому удобно. Чуть сложнее клиент — система падает в обморок, потому что «у нас регламент и Галя закрывает месяц».
            </p>
            <p className="text-white/75 text-[15px] md:text-lg leading-relaxed mb-10">
              Забудьте про инфоцыганские тренинги. Сегодня на дворе жёсткая борьба за каждого клиента. Ваши сотрудники сидят на окладе, пока вы теряете выручку.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="p-6 md:p-8 rounded-sm" style={{ background: 'rgba(201,169,110,0.07)', borderLeft: '3px solid #c9a96e' }}>
              <p className="text-xs tracking-[0.3em] uppercase gold-text mb-3">Кто говорит</p>
              <p className="font-cormorant text-xl md:text-2xl text-off-white leading-snug">
                Я не пифия бизнеса. Я практик с 15-летним опытом в жёстком B2B: заводы, производство, федеральные бренды вроде «Чебупелей». Прихожу и показываю без прикрас, почему ваши менеджеры — тормоза.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ПРОДУКТ */}
      <section className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <SectionTitle eyebrow="Что за полигон">
              5 часов хирургии.<br /><span className="gold-text">Никаких лекций.</span>
            </SectionTitle>
            <p className="text-center font-cormorant text-2xl md:text-3xl text-off-white max-w-2xl mx-auto mb-4">
              Эмоциональный интеллект против ваших тупорылых скриптов.
            </p>
            <p className="text-center text-white/50 text-sm tracking-wide uppercase mb-12">Что делаем с командой от 5 человек</p>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-4">
            {PRODUCT_POINTS.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="p-8 rounded-sm h-full" style={CARD_STYLE}>
                  <Icon name={p.icon} size={30} className="text-gold mb-5" />
                  <p className="text-off-white text-lg leading-relaxed">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* РЕЗУЛЬТАТ */}
      <section id="owner" className="py-24 px-6 md:px-16 lg:px-24" style={ALT_BG}>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <SectionTitle eyebrow="Что получает директор">
              Хирургический срез вместо <span className="gold-text">120-страничных отчётов</span>
            </SectionTitle>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-4">
            {RESULTS.map((r, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="p-7 rounded-sm h-full" style={CARD_STYLE}>
                  <p className="font-cormorant text-5xl gold-text mb-4 leading-none">{r.n}</p>
                  <p className="font-cormorant text-xl text-off-white mb-2">{r.title}</p>
                  <p className="text-white/60 text-sm leading-relaxed">{r.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* УСЛОВИЯ */}
      <section id="format" className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <SectionTitle eyebrow="Кому и почём">
              Жёсткие правила входа
            </SectionTitle>
          </Reveal>
          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-3 grid sm:grid-cols-2 gap-4">
              {RULES.map((r, i) => (
                <Reveal key={i} delay={i * 0.06} className={i === 0 ? 'sm:col-span-2' : ''}>
                  <div className="p-6 rounded-sm h-full" style={CARD_STYLE}>
                    <p className="flex items-center gap-2 text-xs tracking-[0.25em] uppercase gold-text mb-3">
                      <Icon name={r.icon} size={16} />{r.title}
                    </p>
                    <p className="text-white/75 text-sm leading-relaxed">{r.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1} className="md:col-span-2">
              <div className="p-7 rounded-sm h-full flex flex-col" style={{ background: 'rgba(201,169,110,0.07)', border: '1px solid rgba(201,169,110,0.3)' }}>
                <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Рыночный тест</p>
                <p className="font-cormorant text-3xl text-off-white mb-1">1 день · 5 часов</p>
                <p className="text-white/60 text-sm mb-6">Санкт-Петербург, на вашей территории или выбранной площадке</p>
                <div className="mt-auto">
                  <p className="font-cormorant text-5xl gold-text font-semibold mb-1">9 000 ₽</p>
                  <p className="text-gold/80 text-sm mb-5">По безналу. Только 5 компаний.</p>
                  <button onClick={openModal} className="btn-gold w-full px-6 py-4 text-sm tracking-wider uppercase rounded-sm">
                    Подать заявку на тест
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ОБО МНЕ */}
      <section id="about" className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div className="relative">
                <div className="aspect-[3/4] max-w-sm rounded-sm overflow-hidden relative"
                  style={{ border: '1px solid rgba(201,169,110,0.2)' }}>
                  {aboutPhotos.map((src, i) => (
                    <img key={i} src={src} alt="Андрей Дорошенко"
                      className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-1000"
                      style={{ opacity: photoIdx === i ? 1 : 0 }} />
                  ))}
                </div>
                <div className="flex gap-2 mt-5">
                  {aboutPhotos.map((_, i) => (
                    <button key={i} onClick={() => setPhotoIdx(i)}
                      className="h-px transition-all duration-300"
                      style={{ width: 24, background: photoIdx === i ? '#C9A96E' : 'rgba(201,169,110,0.25)' }} />
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Кто ведёт</p>
              <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light mb-6">
                Андрей Дорошенко
              </h2>
              <div className="flex flex-wrap gap-2 mb-8">
                {ABOUT_TAGS.map((t, i) => (
                  <span key={i} className="text-xs tracking-wide px-3 py-1.5 rounded-sm text-white/60"
                    style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)' }}>
                    {t}
                  </span>
                ))}
              </div>
              <p className="text-white/70 text-lg leading-relaxed mb-4">
                15 лет в реальном B2B: заводы, федеральный ритейл, антикризис. Только голая экономика и переговорная практика.
              </p>
              <p className="text-white/50 text-[15px] leading-relaxed mb-4">
                Автор бизнес-симуляции «Город продаж». Выводил на федеральный рынок бренд «Чебупели» и участвовал в создании новой продуктовой категории.
              </p>
              <p className="text-white/50 text-[15px] leading-relaxed mb-6">
                Работал с брендом Федерации бокса России и с Гусь-Хрустальным стекольным заводом.
              </p>
              <div className="p-5 rounded-sm" style={CARD_STYLE}>
                <p className="flex items-center gap-2 text-xs tracking-widest uppercase gold-text mb-3">
                  <Icon name="GraduationCap" size={15} />
                  Образование
                </p>
                <ul className="flex flex-col gap-2 text-white/65 text-sm leading-relaxed mb-5">
                  <li className="flex gap-2"><Icon name="ChevronRight" size={15} className="text-gold shrink-0 mt-0.5" />Экономическое высшее образование</li>
                  <li className="flex gap-2"><Icon name="ChevronRight" size={15} className="text-gold shrink-0 mt-0.5" />Диплом о профессиональной переподготовке: арбитражный и антикризисный управляющий (2025)</li>
                  <li className="flex gap-2"><Icon name="ChevronRight" size={15} className="text-gold shrink-0 mt-0.5" />Сертификат по фасилитации, школа НЛП Плигина и Герасимова, программа NLP-MBA (2013)</li>
                </ul>
                <div className="grid grid-cols-2 gap-3">
                  {DIPLOMAS.map((d, i) => (
                    <button key={i} type="button" onClick={() => setLightbox(d.src)}
                      className="group text-left rounded-sm overflow-hidden"
                      style={{ border: '1px solid rgba(201,169,110,0.25)' }}>
                      <img src={d.src} alt={d.caption} className="w-full h-28 object-cover object-top group-hover:opacity-80 transition-opacity" />
                      <span className="block px-2 py-1.5 text-[11px] text-white/50">{d.caption}</span>
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ФИНАЛ */}
      <section id="contact" className="py-24 px-6 md:px-16 lg:px-24" style={ALT_BG}>
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="font-cormorant text-3xl md:text-5xl text-off-white font-light leading-tight">
                Хотите и дальше платить тунеядцам, пока Галя печатает накладные — <span className="text-white/40">продолжайте.</span>{' '}
                <span className="gold-gradient">Хотите встряхнуть болото — подавайте заявку.</span>
              </h2>
              <div className="section-divider mt-6" />
              <p className="inline-flex items-center gap-2 mt-6 text-sm tracking-wide gold-text border border-gold/40 px-4 py-2">
                <Icon name="Flame" size={15} />
                Осталось мест: 5 из 5
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mb-14">
            <ContactForm />
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-center text-white/60 text-sm mb-6">
              Андрей Дорошенко · Санкт-Петербург · октябрь
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              <a href="tel:89206200034" className="flex items-center gap-2 gold-text hover:opacity-70 transition-opacity">
                <Icon name="Phone" size={15} className="text-gold/60" />
                <span className="font-cormorant text-xl">+7 (920) 620-00-34</span>
              </a>
              <a href="mailto:and-doroshe@mail.ru" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
                <Icon name="Mail" size={15} className="text-white/30" />
                <span className="text-sm">and-doroshe@mail.ru</span>
              </a>
              <a href="https://t.me/adprodmarketing" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/50 hover:text-gold transition-colors">
                <Icon name="Send" size={15} className="text-white/30" />
                <span className="text-sm">@adprodmarketing</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(201,169,110,0.1)', background: '#060606' }} className="py-8 px-6 md:px-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="font-cormorant text-lg gold-text">Андрей Дорошенко</p>
            <p className="text-white/25 text-xs mt-1">Рыночный тест продаж · Санкт-Петербург</p>
          </div>
          <div className="flex gap-4">
            <a href="https://t.me/adprodmarketing" target="_blank" rel="noopener noreferrer"
              className="text-white/25 hover:text-gold transition-colors">
              <Icon name="Send" size={16} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}