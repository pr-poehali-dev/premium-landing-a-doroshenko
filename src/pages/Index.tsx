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

const INTERESTS = [
  { value: 'rentgen', label: 'Рентген' },
  { value: 'reload', label: 'Перезагрузка' },
  { value: 'other', label: 'Другое' },
];

const REASONS = [
  {
    icon: 'MicOff',
    title: 'Скрипт слышно за три секунды',
    text: 'Умный закупщик сразу чувствует шаблон и закрывает дверь.',
  },
  {
    icon: 'Database',
    title: 'CRM не продаёт',
    text: 'Она фиксирует движение сделки, но не объясняет, почему клиент ушёл.',
  },
  {
    icon: 'AlertTriangle',
    title: 'Страх отказа парализует',
    text: 'Менеджеры боятся прямого вопроса, стесняются назвать реальную цену и избегают спора.',
  },
];

const POLYGON_POINTS = [
  { icon: 'ShieldOff', text: 'кто начинает защищаться и оправдываться' },
  { icon: 'TrendingDown', text: 'кто сразу сдаёт маржу ради закрытия сделки' },
  { icon: 'Swords', text: 'а кто действительно держит позицию и ведёт переговоры на равных' },
];

const OWNER_POINTS = [
  { icon: 'Users', text: 'Кто в команде тянет сложные сделки, а кто просто отбывает номер.' },
  { icon: 'TrendingDown', text: 'На каком этапе вы теряете маржу (первый контакт, защита цены, дожим).' },
  { icon: 'Search', text: 'Где проблема в людях, а где слаб сам продукт и оффер компании.' },
];

const PRODUCTS = [
  {
    emoji: '🩻',
    title: '01. Рентген',
    subtitle: 'Диагностический полигон',
    price: '30 000 ₽',
    meta: '4–5 часов · 4–8 человек',
    bullets: [
      'Экспресс-разбор текущего коммерческого предложения.',
      'Переговорный стресс-тест на тренажёре «Город продаж».',
      'Разбор поведения каждого участника и фиксация зон потери маржи.',
    ],
    footer: 'Вы покупаете не тренинг, а объективный снимок отдела продаж.',
    cta: 'НАЗНАЧИТЬ РЕНТГЕН — 30 000 ₽',
    preset: 'Рентген · Диагностический полигон',
  },
  {
    emoji: '🔄',
    title: '02. Перезагрузка',
    subtitle: 'От оффера до реального клиента',
    price: '100 000 ₽',
    meta: '3 дня',
    bullets: [
      'День 1. Продукт: пересобираем оффер под реальную боль клиента, убираем слабые места.',
      'День 2. Полигон: моделируем жёсткие переговорные сценарии, ставим устойчивость к отказам.',
      'День 3. Поле: выходим в прямые контакты с реальными клиентами под моим живым наблюдением.',
    ],
    footer: 'Проверяем новую логику диалога на реальном рынке.',
    cta: 'ОБСУДИТЬ ПЕРЕЗАГРУЗКУ — 100 000 ₽',
    preset: 'Перезагрузка · От оффера до реального клиента',
  },
];

const NO_TRAINING = [
  'Написать скрипт помогут скриптологи.',
  'Настроить воронку — интеграторы CRM.',
  'Накачать мотивацией — бизнес-тренеры.',
];

const ABOUT_TAGS = ['B2B', 'Продуктовый аудит', 'Переговоры', 'Бокс'];

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

function isFormValid(form: FormState) {
  return form.name.trim() !== '' && form.company.trim() !== '' && form.phone.trim() !== '';
}

async function sendLead(form: FormState, type: string) {
  try {
    const channelLabel = CHANNELS.find(c => c.value === form.channel)?.label || '—';
    const interestLabel = INTERESTS.find(i => i.value === form.interest)?.label || '—';
    const res = await fetch('https://functions.poehali.dev/fc323d06-bbf9-4e34-b478-9a1d63552d0d', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        phone: form.phone,
        company: form.company,
        city: form.city,
        message: `Канал связи: ${channelLabel}. Email: ${form.email || '—'}. Время связи: ${form.time || '—'}. Интересует: ${interestLabel}.`,
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

      <div className={span}>
        <p className="text-white/40 text-xs tracking-wide uppercase mb-2">Что интересует</p>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map(i => (
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
    </>
  );
}

function Modal({ open, onClose, presetTitle }: { open: boolean; onClose: () => void; presetTitle?: string }) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await sendLead(form, presetTitle || 'header');
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
            <p className="text-white/60 font-golos text-sm">Андрей напишет вам лично в ближайшее время</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-4">
            <h3 className="font-cormorant text-2xl text-off-white mb-1">
              {presetTitle ? presetTitle : 'Назначить дату полигона'}
            </h3>
            <p className="text-white/50 text-sm font-golos mb-2">
              Оставьте контакты — обсудим детали и подберём формат
            </p>
            <LeadFields form={form} setForm={setForm} />
            <button type="submit" disabled={loading || !isFormValid(form)} className="btn-gold rounded py-3 text-sm mt-2 disabled:opacity-40">
              {loading ? 'Отправляем...' : 'Отправить'}
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
        <p className="text-white/50 text-sm">Андрей напишет вам лично в ближайшее время</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
      <LeadFields form={form} setForm={setForm} wide />
      <div className="md:col-span-2">
        <button type="submit" disabled={loading || !isFormValid(form)}
          className="btn-gold rounded-sm py-4 px-12 text-sm tracking-wider uppercase disabled:opacity-40">
          {loading ? 'Отправляем...' : 'Назначить дату полигона'}
        </button>
      </div>
    </form>
  );
}

export default function Index() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPreset, setModalPreset] = useState<string | undefined>(undefined);
  const [photoIdx, setPhotoIdx] = useState(0);

  const openModal = (preset?: string) => {
    setModalPreset(preset);
    setModalOpen(true);
  };

  const hero = useInView(0.05);
  const intro = useInView(0.1);
  const products = useInView(0.1);
  const faq = useInView(0.1);
  const about = useInView(0.1);
  const contact = useInView(0.1);

  useEffect(() => {
    const interval = setInterval(() => setPhotoIdx(i => (i + 1) % 2), 5000);
    return () => clearInterval(interval);
  }, []);

  const aboutPhotos = [PHOTO_ABOUT_1, PHOTO_ABOUT_2];

  return (
    <div className="min-h-screen bg-obsidian text-off-white font-golos overflow-x-hidden">
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} presetTitle={modalPreset} />

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
          <a href="#games" className="hover:text-white transition-colors">Полигон</a>
          <a href="#products" className="hover:text-white transition-colors">Программы</a>
          <a href="#about" className="hover:text-white transition-colors">Обо мне</a>
          <a href="#contact" className="hover:text-white transition-colors">Контакты</a>
        </nav>
        <button onClick={() => openModal()}
          className="text-xs tracking-widest uppercase gold-text hover:opacity-70 transition-opacity border border-gold/30 px-4 py-2 hidden md:block">
          Назначить полигон
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
            <p className={`text-xs tracking-[0.3em] uppercase text-gold/70 mb-8 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '0.1s' }}>
              🩻 Рентген и перезагрузка отдела продаж
            </p>

            <h1 className={`font-cormorant font-light leading-[1.05] mb-6 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ fontSize: 'clamp(2.1rem, 4.6vw, 4rem)', transitionDelay: '0.2s' }}>
              CRM работает.<br />Скрипты написаны.<br />
              <span className="gold-gradient">А продаёт ли команда?</span>
            </h1>

            <p className={`text-white/75 text-[15px] md:text-lg leading-relaxed mb-4 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '0.28s' }}>
              А в живом разговоре менеджер теряется: при первом «дорого» падает в скидку, читает заготовленный шаблон или отпускает клиента.
            </p>

            <p className={`text-white/75 text-[15px] md:text-lg leading-relaxed mb-10 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '0.34s' }}>
              Бизнес-полигон Андрея Дорошенко — это 4–5 часов переговорного стресс-теста. Я не учу менеджеров «правильно продавать». Я создаю условия, в которых видно, как они продают на самом деле.
            </p>

            <div className={`flex flex-col sm:flex-row gap-4 mb-6 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '0.5s' }}>
              <button onClick={() => openModal('Рентген · Диагностический полигон')} className="btn-gold px-8 py-4 text-sm tracking-wider uppercase rounded-sm">
                Назначить дату полигона
              </button>
            </div>

            <p className={`flex items-center gap-2 text-gold/80 text-xs tracking-wide transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '0.6s' }}>
              <Icon name="MapPin" size={14} className="shrink-0" />
              Санкт-Петербург · Москва · Выезд на предприятие
            </p>
          </div>
        </div>

        <div className="hidden md:block absolute right-0 top-16 bottom-0 w-1/2">
          <div className="absolute inset-0 z-10" style={{
            background: 'linear-gradient(to right, #0A0A0A 0%, transparent 35%)'
          }} />
          <img src={PHOTO_HERO} alt="Андрей Дорошенко"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.85) contrast(1.05)', objectPosition: 'top' }} />
          <div className="absolute inset-0 z-10" style={{
            background: 'linear-gradient(to top, #0A0A0A 0%, transparent 40%)'
          }} />
        </div>
      </section>

      {/* ПОЧЕМУ БУКСУЮТ */}
      <section id="games" ref={intro.ref} className="py-24 px-6 md:px-16 lg:px-24"
        style={{ borderTop: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(180deg, #0A0A0A 0%, #111 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <div className={`text-center mb-14 transition-all duration-700 ${intro.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <h2 className="font-cormorant text-3xl md:text-5xl text-off-white font-light mb-6">
              Почему привычные инструменты буксуют
            </h2>
            <p className="text-white/60 text-[15px] md:text-lg leading-relaxed max-w-xl mx-auto">
              Продажи — это не процедура. Это точный диалог, скорость мышления и характер.
            </p>

            <a href="https://t.me/adprodmarketing" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 text-sm tracking-wide rounded-sm border border-gold/30 gold-text hover:bg-gold/10 transition-colors">
              <Icon name="Send" size={16} />
              Подписаться на телеграм-канал «Дорошенко — бизнес-игры»
            </a>
          </div>

          <div className={`grid sm:grid-cols-3 gap-4 transition-all duration-700 ${intro.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '0.15s' }}>
            {REASONS.map((s, i) => (
              <div key={i} className="p-7 rounded-sm text-left"
                style={{ background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.14)' }}>
                <Icon name={s.icon} size={26} className="text-gold mb-4" />
                <p className="font-cormorant text-xl gold-text mb-2">{s.title}</p>
                <p className="text-white/60 text-sm leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ЧТО ПРОИСХОДИТ НА ПОЛИГОНЕ */}
      <section className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-cormorant text-3xl md:text-5xl text-off-white font-light mb-6">
              Что происходит <span className="gold-text">на полигоне</span>
            </h2>
            <p className="text-white/60 text-[15px] md:text-lg leading-relaxed max-w-2xl mx-auto">
              Мы убираем защитный контур: скрипты, регламенты и «я уточню и перезвоню». Остаётся чистый контакт: клиент → возражение → защита позиции.
              На переговорном тренажёре команда проходит через дефицит бюджета, прессинг по цене и конкурентов. За 4 часа становится видно:
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {POLYGON_POINTS.map((s, i) => (
              <div key={i} className="p-7 rounded-sm text-left flex items-start gap-3"
                style={{ background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.14)' }}>
                <Icon name={s.icon} size={22} className="text-gold shrink-0 mt-0.5" />
                <p className="text-white/70 text-sm leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ЧТО ЗАБИРАЕТ СОБСТВЕННИК */}
      <section className="py-24 px-6 md:px-16 lg:px-24"
        style={{ borderTop: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(180deg, #0A0A0A 0%, #111 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-cormorant text-3xl md:text-5xl text-off-white font-light mb-4">
              Что забирает собственник
            </h2>
            <p className="text-white/60 text-[15px] md:text-lg leading-relaxed max-w-2xl mx-auto">
              Главный результат — не игра, а прозрачная картина вашего сбыта. Вы увидите без отчётов и прикрас:
            </p>
            <div className="section-divider mt-6" />
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {OWNER_POINTS.map((w, i) => (
              <div key={i} className="p-7 rounded-sm text-left flex items-start gap-3"
                style={{ background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.14)' }}>
                <Icon name={w.icon} size={22} className="text-gold shrink-0 mt-0.5" />
                <p className="text-white/70 text-sm leading-relaxed">{w.text}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-white/70 text-[15px] leading-relaxed max-w-xl mx-auto">
            Итог: карта переговорных компетенций команды и конкретный следующий шаг для РОПа.
          </p>
        </div>
      </section>

      {/* ПРОДУКТЫ */}
      <section id="products" ref={products.ref} className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <div className={`text-center mb-14 transition-all duration-700 ${products.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Два формата
            </h2>
            <div className="section-divider mt-6" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {PRODUCTS.map((p, i) => (
              <div key={i}
                className={`p-8 rounded-sm flex flex-col transition-all duration-700 ${products.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.16)', transitionDelay: `${0.1 + i * 0.1}s` }}>
                <div className="text-4xl mb-4">{p.emoji}</div>
                <p className="text-off-white font-medium text-lg mb-1 leading-snug">{p.title}</p>
                <p className="text-white/50 text-sm mb-3">{p.subtitle}</p>
                <p className="font-cormorant text-3xl gold-text font-semibold mb-3">{p.price}</p>
                <p className="text-xs tracking-widest uppercase text-white/30 mb-5">{p.meta}</p>
                <ul className="text-white/65 text-sm leading-relaxed mb-5 flex-1 flex flex-col gap-3">
                  {p.bullets.map((b, j) => (
                    <li key={j} className="flex gap-2">
                      <Icon name="ChevronRight" size={15} className="text-gold shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-gold/70 text-xs italic mb-6">{p.footer}</p>
                <button onClick={() => openModal(p.preset)}
                  className="btn-gold px-6 py-4 text-sm tracking-wider uppercase rounded-sm">
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* БЕЗ СКАЗОК */}
      <section id="faq" ref={faq.ref} className="py-24 px-6 md:px-16 lg:px-24"
        style={{ borderTop: '1px solid rgba(201,169,110,0.1)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className={`transition-all duration-700 ${faq.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Без сказок про «+40% к выручке»</p>
            <div className="section-divider mb-8" />
            <p className="text-white/70 text-lg leading-relaxed mb-4">
              Я 15 лет в B2B и не раздаю пустых обещаний.
            </p>
            <p className="text-white/60 text-[15px] leading-relaxed">
              Если продукт потерял ценность на рынке — бессмысленно дрессировать сейлзов. Сначала нужно пересобрать позиционирование.
              Если продукт сильный, но команда боится звонить — полигон убирает этот затык за один день.
            </p>
          </div>
        </div>
      </section>

      {/* ОБО МНЕ */}
      <section id="about" ref={about.ref} className="py-24 px-6 md:px-16 lg:px-24"
        style={{ borderTop: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(180deg, #0A0A0A 0%, #111 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className={`transition-all duration-700 ${about.inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
              style={{ transitionDelay: '0.1s' }}>
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
            </div>

            <div className={`transition-all duration-700 ${about.inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
              style={{ transitionDelay: '0.2s' }}>
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
                15 лет практики на стыке реального B2B-маркетинга, продуктового аудита и коммерции.
              </p>
              <p className="text-white/50 text-[15px] leading-relaxed mb-4">
                Выводил на федеральный рынок бренд «Чебупели» — продукт, который встал на полки по всей стране и с нуля создал новую категорию.
              </p>
              <p className="text-white/50 text-[15px] leading-relaxed mb-4">
                Работал с Федерацией бокса России — знаю изнутри, как воспитывать выдержку под прессингом и характер побеждать на характере.
              </p>
              <p className="text-white/50 text-[15px] leading-relaxed">
                Автор бизнес-симуляции «Город продаж».
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* НЕ НУЖЕН ЕЩЁ ОДИН ТРЕНИНГ */}
      <section className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-cormorant text-3xl md:text-5xl text-off-white font-light mb-8">
            Вам не нужен ещё один тренинг
          </h2>
          <div className="flex flex-col gap-3 max-w-lg mx-auto mb-8 text-left">
            {NO_TRAINING.map((t, i) => (
              <div key={i} className="flex items-center gap-3 text-white/50 text-[15px]">
                <Icon name="X" size={16} className="text-white/25 shrink-0" />
                <span>{t}</span>
              </div>
            ))}
          </div>
          <p className="text-white/70 text-lg leading-relaxed max-w-xl mx-auto">
            Если вам нужно увидеть, что происходит с вашей маржой и людьми в реальном контакте с клиентом — добро пожаловать на полигон.
          </p>
        </div>
      </section>

      {/* КОНТАКТЫ */}
      <section id="contact" ref={contact.ref} className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <div className={`text-center mb-14 transition-all duration-700 ${contact.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Назначить дату полигона
            </h2>
            <div className="section-divider mt-6" />
            <p className="text-white/50 text-[15px] leading-relaxed mt-6">
              Свяжитесь напрямую — разберём ваш текущий оффер и назначим дату полигона.
            </p>
          </div>

          <div className={`transition-all duration-700 mb-14 ${contact.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: '0.15s' }}>
            <ContactForm />
          </div>

          <div className={`flex flex-wrap items-center justify-center gap-x-8 gap-y-4 transition-all duration-700 ${contact.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: '0.3s' }}>
            <a href="tel:89206200034" className="flex items-center gap-2 gold-text hover:opacity-70 transition-opacity">
              <Icon name="Phone" size={15} className="text-gold/60" />
              <span className="font-cormorant text-xl">+7 (920) 620-00-34</span>
              <span className="text-xs text-white/30">Телефон / WhatsApp</span>
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
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(201,169,110,0.1)', background: '#060606' }} className="py-8 px-6 md:px-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="font-cormorant text-lg gold-text">Андрей Дорошенко</p>
            <p className="text-white/25 text-xs mt-1">Бизнес-полигон для отдела продаж</p>
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