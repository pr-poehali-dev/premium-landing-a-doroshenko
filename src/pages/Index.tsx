import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

const CASES = [
  {
    company: 'Территория Обжарки',
    city: 'Владимир',
    budget: '300 000 ₽/мес',
    lead: '1 400 ₽',
    order: '12 500 ₽',
    tag: 'Производство кофе',
    initial: 'ТО',
  },
  {
    company: 'Промсиз',
    city: 'Гусь-Хрустальный',
    budget: '110 000 ₽/мес',
    lead: '2 100 ₽',
    order: '14 000 ₽',
    tag: 'Промышленное производство',
    initial: 'ПС',
  },
  {
    company: 'Литмаш М',
    city: 'Ивановская обл.',
    budget: '500 000 ₽/мес',
    lead: '8 000 ₽',
    order: '25 000 ₽',
    tag: 'Машиностроение',
    initial: 'ЛМ',
  },
];

const OFFER_ITEMS = [
  { icon: 'Target', text: 'Настройка Яндекс.Директ под целевую аудиторию' },
  { icon: 'Lightbulb', text: 'Формирование и тестирование офферов для получения лидов' },
  { icon: 'BarChart2', text: 'Контроль рекламной кампании 1 месяц' },
  { icon: 'MessageCircle', text: 'Обратная связь с отделом продаж' },
];

const HOW_ITEMS = [
  { icon: 'FileText', text: 'Работаем по безналу и договору' },
  { icon: 'Wallet', text: 'Минимальный рекламный бюджет на 1 месяц — 75 000 ₽ (НДС платится Яндексу)' },
  { icon: 'Clock', text: 'Первые лиды — через 2 недели' },
];

function useInView(threshold = 0.15) {
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

function Modal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', phone: '', city: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('https://functions.poehali.dev/fc323d06-bbf9-4e34-b478-9a1d63552d0d', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: 'audit' }),
      });
      if (res.ok) setSent(true);
    } catch {
      setSent(true);
    }
    setLoading(false);
  };

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md" style={{ background: '#111', border: '1px solid rgba(201,169,110,0.35)', borderRadius: 4 }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">
          <Icon name="X" size={20} />
        </button>
        {sent ? (
          <div className="p-10 text-center">
            <div className="text-5xl mb-4">✓</div>
            <p className="font-cormorant text-2xl gold-text mb-2">Заявка отправлена</p>
            <p className="text-white/60 font-golos text-sm">Андрей свяжется с вами в ближайшее время</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-4">
            <h3 className="font-cormorant text-2xl text-off-white mb-1">Получить аудит и оффер</h3>
            <p className="text-white/50 text-sm font-golos mb-2">Заполните форму — Андрей свяжется с вами лично</p>
            <input
              className="input-dark rounded px-4 py-3 text-sm w-full"
              placeholder="ФИО *"
              required
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            />
            <input
              className="input-dark rounded px-4 py-3 text-sm w-full"
              placeholder="Телефон *"
              required
              type="tel"
              value={form.phone}
              onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
            />
            <input
              className="input-dark rounded px-4 py-3 text-sm w-full"
              placeholder="Город"
              value={form.city}
              onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
            />
            <textarea
              className="input-dark rounded px-4 py-3 text-sm w-full resize-none"
              placeholder="Расскажите подробнее о вашем бизнесе"
              rows={3}
              value={form.message}
              onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
            />
            <button type="submit" disabled={loading} className="btn-gold rounded py-3 text-sm mt-2 disabled:opacity-60">
              {loading ? 'Отправляем...' : 'Отправить заявку'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function Index() {
  const [modalOpen, setModalOpen] = useState(false);

  const hero = useInView(0.1);
  const cases = useInView(0.1);
  const about = useInView(0.1);
  const offer = useInView(0.1);
  const how = useInView(0.1);
  const bottom = useInView(0.1);

  return (
    <div className="min-h-screen bg-obsidian text-off-white font-golos overflow-x-hidden">
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 py-5"
        style={{ background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(201,169,110,0.1)' }}>
        <div className="flex items-center gap-3">
          <img
            src="https://cdn.poehali.dev/projects/bb03cd52-a7e1-49a3-8dc8-9ec2c7948b7a/bucket/ffd046c4-b35f-40c2-9b83-50f0dd9100ba.png"
            alt="Андрей Дорошенко"
            className="w-8 h-8 rounded-full object-cover object-top"
            style={{ border: '1px solid rgba(201,169,110,0.4)' }}
          />
          <div className="font-cormorant text-lg tracking-widest uppercase gold-text">А. Дорошенко</div>
        </div>
        <nav className="hidden md:flex gap-8 text-sm text-white/50 tracking-wide">
          <a href="#cases" className="hover:text-white transition-colors">Кейсы</a>
          <a href="#about" className="hover:text-white transition-colors">Обо мне</a>
          <a href="#offer" className="hover:text-white transition-colors">Услуги</a>
          <a href="#contact" className="hover:text-white transition-colors">Контакт</a>
        </nav>
        <a href="tel:89206200034" className="text-sm gold-text hover:opacity-80 transition-opacity font-medium">
          8 920 620-00-34
        </a>
      </header>

      {/* HERO */}
      <section ref={hero.ref} className="relative min-h-screen flex flex-col justify-center noise-bg pt-24 pb-20 px-6 md:px-16 lg:px-24">
        {/* Background grid pattern */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(201,169,110,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.03) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />
        {/* Gold glow */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-5xl">
          <p className={`text-xs tracking-[0.3em] uppercase text-gold mb-8 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
            style={{ transitionDelay: '0.1s' }}>
            Стратег-Директолог · Яндекс.Директ
          </p>

          <h1 className={`font-cormorant font-light leading-[1.1] mb-8 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ fontSize: 'clamp(2.4rem, 5.5vw, 5rem)', transitionDelay: '0.2s' }}>
            Привлекаем лиды<br />
            для вашего производства<br />
            <span className="gold-gradient">через Яндекс.Директ</span>
          </h1>

          <div className={`mb-10 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
            style={{ transitionDelay: '0.35s' }}>
            <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl font-light">
              Лиды от <span className="text-white font-medium">1 400 ₽</span> до <span className="text-white font-medium">8 000 ₽</span>,&nbsp;
              заказы от <span className="text-white font-medium">12 500 ₽</span> до <span className="text-white font-medium">25 000 ₽</span>
            </p>
            <p className="text-white/40 text-sm mt-3">
              Настройка РК — 50 000 ₽&nbsp;&nbsp;·&nbsp;&nbsp;Бюджет на рекламу от 75 000 ₽/мес
            </p>
          </div>

          <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
            style={{ transitionDelay: '0.5s' }}>
            <button onClick={() => setModalOpen(true)} className="btn-gold px-10 py-4 text-sm tracking-wider uppercase rounded">
              Получить аудит и оффер
            </button>
            <a href="#cases" className="flex items-center gap-2 px-8 py-4 text-sm tracking-wide text-white/60 hover:text-white transition-colors border border-white/10 rounded hover:border-white/25">
              Смотреть кейсы
              <Icon name="ArrowDown" size={16} />
            </a>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 text-xs tracking-widest">
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-gold/40" />
        </div>
      </section>

      {/* STATS BAR */}
      <div style={{ background: 'linear-gradient(90deg, #111 0%, #1a1a1a 50%, #111 100%)', borderTop: '1px solid rgba(201,169,110,0.15)', borderBottom: '1px solid rgba(201,169,110,0.15)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-0">
          {[
            { value: '3', label: 'кейса с производствами' },
            { value: '7+', label: 'лет в performance-маркетинге' },
            { value: '50K', label: 'настройка РК под ключ' },
            { value: '2 нед.', label: 'до первых лидов' },
          ].map((s, i) => (
            <div key={i} className="py-8 px-6 text-center" style={{ borderRight: i < 3 ? '1px solid rgba(201,169,110,0.1)' : 'none' }}>
              <div className="font-cormorant text-3xl md:text-4xl gold-text font-semibold">{s.value}</div>
              <div className="text-white/40 text-xs mt-1 tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CASES */}
      <section id="cases" ref={cases.ref} className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${cases.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Реальные результаты</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">Кейсы</h2>
            <div className="section-divider mt-6" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {CASES.map((c, i) => (
              <div
                key={i}
                className={`card-case rounded-sm p-8 transition-all duration-700 ${cases.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${0.1 + i * 0.15}s` }}
              >
                {/* Logo placeholder */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-sm flex items-center justify-center font-cormorant text-xl font-bold"
                    style={{ background: 'linear-gradient(135deg, rgba(201,169,110,0.15), rgba(201,169,110,0.05))', border: '1px solid rgba(201,169,110,0.3)', color: '#C9A96E' }}>
                    {c.initial}
                  </div>
                  <div>
                    <p className="font-medium text-off-white text-sm">{c.company}</p>
                    <p className="text-white/40 text-xs mt-0.5">{c.city}</p>
                  </div>
                </div>

                <div className="text-xs tracking-wider uppercase text-gold/60 mb-6 pb-4"
                  style={{ borderBottom: '1px solid rgba(201,169,110,0.12)' }}>
                  {c.tag}
                </div>

                <div className="space-y-5">
                  <div>
                    <p className="text-white/35 text-xs tracking-wide mb-1">Рекламный бюджет</p>
                    <p className="font-cormorant text-2xl text-off-white">{c.budget}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/35 text-xs tracking-wide mb-1">Стоимость лида</p>
                      <p className="font-cormorant text-xl gold-text font-semibold">{c.lead}</p>
                    </div>
                    <div>
                      <p className="text-white/35 text-xs tracking-wide mb-1">Стоимость заказа</p>
                      <p className="font-cormorant text-xl text-off-white">{c.order}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" ref={about.ref} className="py-24 px-6 md:px-16 lg:px-24"
        style={{ background: 'linear-gradient(180deg, #0A0A0A 0%, #111 50%, #0A0A0A 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Photo side */}
            <div className={`transition-all duration-700 ${about.inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
              style={{ transitionDelay: '0.1s' }}>
              <div className="relative">
                <div className="aspect-[3/4] max-w-sm rounded-sm overflow-hidden"
                  style={{ border: '1px solid rgba(201,169,110,0.25)' }}>
                  <img
                    src="https://cdn.poehali.dev/projects/bb03cd52-a7e1-49a3-8dc8-9ec2c7948b7a/bucket/42dc42eb-1445-4a0e-9a00-0a3400fe8b64.png"
                    alt="Андрей Дорошенко"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                {/* Gold accent corner */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-sm"
                  style={{ border: '1px solid rgba(201,169,110,0.2)', zIndex: -1 }} />
                <div className="absolute -top-4 -left-4 w-16 h-16 rounded-sm"
                  style={{ border: '1px solid rgba(201,169,110,0.1)', zIndex: -1 }} />
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <a href="https://t.me/adprodmarketing" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-white/50 hover:text-gold transition-colors group">
                  <div className="w-8 h-8 rounded flex items-center justify-center"
                    style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)' }}>
                    <Icon name="Send" size={14} className="text-gold" />
                  </div>
                  <span>Telegram-канал</span>
                  <Icon name="ArrowUpRight" size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a href="https://max.ru/u/f9LHodD0cOJeh1VeDiOnEVtgDFXOG1s8s87I-zodKmshv0Z-Mo9AAb_D5b0" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-white/50 hover:text-gold transition-colors group">
                  <div className="w-8 h-8 rounded flex items-center justify-center"
                    style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)' }}>
                    <Icon name="MessageSquare" size={14} className="text-gold" />
                  </div>
                  <span>ВКонтакте / MAX</span>
                  <Icon name="ArrowUpRight" size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>

            {/* Text side */}
            <div className={`transition-all duration-700 ${about.inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
              style={{ transitionDelay: '0.2s' }}>
              <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Обо мне</p>
              <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light mb-8">
                Андрей<br />Дорошенко
              </h2>
              <div className="w-12 h-px bg-gold mb-8" />

              <div className="space-y-5 text-white/65 leading-relaxed text-[15px]">
                <p>
                  Более 7 лет я специализируюсь на одной задаче — приводить платёжеспособных клиентов в производственные компании через Яндекс.Директ. Не интернет-магазины, не услуги массового рынка, а именно производство: металлообработка, деревообработка, пищевая промышленность, промышленное оборудование.
                </p>
                <p>
                  Я понимаю специфику B2B-продаж: длинный цикл сделки, роль закупщика и технолога в решении, сезонность заказов. Именно поэтому мои рекламные кампании строятся не вокруг CTR и показов, а вокруг реального экономического результата — стоимости заказа, а не лида.
                </p>
                <p>
                  В портфеле — кейсы с рекламными бюджетами от 110 000 до 500 000 ₽/мес. Я лично веду каждый проект, без посредников и субподрядчиков. Работаю по договору, отчитываюсь цифрами.
                </p>
                <p>
                  Моя методика: сначала понять ваш рынок и конкурентов, потом сформировать оффер, который реально отличает вас от других. Только после этого — запускать рекламу. Такой подход даёт результат уже в первые 2 недели.
                </p>
                <p>
                  Базируюсь в Москве, работаю с производствами по всей России. Офис — территория завода Арма, Курская.
                </p>
              </div>

              <button onClick={() => setModalOpen(true)}
                className="mt-10 flex items-center gap-3 text-sm tracking-wider uppercase gold-text hover:opacity-70 transition-opacity">
                <span>Обсудить ваш проект</span>
                <Icon name="ArrowRight" size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* OFFER */}
      <section id="offer" ref={offer.ref} className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${offer.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Что входит</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Настройка РК —{' '}
              <span className="gold-gradient">50 000 ₽</span>
            </h2>
            <div className="section-divider mt-6" />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {OFFER_ITEMS.map((item, i) => (
              <div
                key={i}
                className={`card-case rounded-sm p-7 flex items-start gap-5 transition-all duration-700 ${offer.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${0.1 + i * 0.12}s` }}
              >
                <div className="w-10 h-10 rounded flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.25)' }}>
                  <Icon name={item.icon} fallback="Star" size={18} className="text-gold" />
                </div>
                <p className="text-off-white/80 leading-relaxed text-[15px]">{item.text}</p>
              </div>
            ))}
          </div>

          <div className={`mt-12 text-center transition-all duration-700 ${offer.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '0.55s' }}>
            <button onClick={() => setModalOpen(true)} className="btn-gold px-12 py-4 text-sm tracking-wider uppercase rounded">
              Получить аудит и оффер
            </button>
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section id="how" ref={how.ref} className="py-24 px-6 md:px-16 lg:px-24"
        style={{ background: 'linear-gradient(180deg, #0A0A0A 0%, #0f0f0f 100%)', borderTop: '1px solid rgba(201,169,110,0.1)' }}>
        <div className="max-w-5xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${how.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Условия сотрудничества</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">Как мы работаем</h2>
            <div className="section-divider mt-6" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {HOW_ITEMS.map((item, i) => (
              <div
                key={i}
                className={`text-center transition-all duration-700 ${how.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${0.1 + i * 0.15}s` }}
              >
                <div className="w-16 h-16 rounded-sm flex items-center justify-center mx-auto mb-6"
                  style={{ background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.2)' }}>
                  <Icon name={item.icon} fallback="Star" size={24} className="text-gold" />
                </div>
                <p className="text-white/65 leading-relaxed text-[15px]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM FORM */}
      <section id="contact" ref={bottom.ref} className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-2xl mx-auto">
          <div className={`text-center mb-12 transition-all duration-700 ${bottom.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Бесплатно</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">Получить аудит</h2>
            <p className="text-white/45 mt-4 text-[15px] leading-relaxed">
              Проанализирую ваш рынок, оценю конкурентов и предложу стратегию привлечения лидов
            </p>
            <div className="section-divider mt-6" />
          </div>

          <BottomForm onSuccess={() => {}} />
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(201,169,110,0.12)', background: '#080808' }} className="py-10 px-6 md:px-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="font-cormorant text-xl gold-text mb-1">Дорошенко Андрей Анатольевич</p>
            <p className="text-white/35 text-xs">Стратег-директолог · Яндекс.Директ для производств</p>
            <p className="text-white/25 text-xs mt-1">Москва, Курская, территория завода Арма</p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-right">
            <a href="tel:89206200034" className="gold-text hover:opacity-70 transition-opacity">8 920 620-00-34</a>
            <a href="mailto:and-doroshe@mail.ru" className="text-white/40 hover:text-white transition-colors">and-doroshe@mail.ru</a>
            <div className="flex gap-4 mt-2 justify-end">
              <a href="https://t.me/adprodmarketing" target="_blank" rel="noopener noreferrer"
                className="text-white/30 hover:text-gold transition-colors flex items-center gap-1.5 text-xs">
                <Icon name="Send" size={13} />
                Telegram
              </a>
              <a href="https://max.ru/u/f9LHodD0cOJeh1VeDiOnEVtgDFXOG1s8s87I-zodKmshv0Z-Mo9AAb_D5b0" target="_blank" rel="noopener noreferrer"
                className="text-white/30 hover:text-gold transition-colors flex items-center gap-1.5 text-xs">
                <Icon name="MessageSquare" size={13} />
                MAX
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function BottomForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({ name: '', city: '', company: '', phone: '', agree: false });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agree) return;
    setLoading(true);
    try {
      const res = await fetch('https://functions.poehali.dev/fc323d06-bbf9-4e34-b478-9a1d63552d0d', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: 'bottom' }),
      });
      if (res.ok) { setSent(true); onSuccess(); }
    } catch {
      setSent(true);
    }
    setLoading(false);
  };

  if (sent) return (
    <div className="text-center py-16">
      <p className="font-cormorant text-4xl gold-text mb-3">Заявка принята</p>
      <p className="text-white/50 text-sm">Андрей свяжется с вами в течение рабочего дня</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid md:grid-cols-2 gap-4">
        <input
          className="input-dark rounded px-4 py-3.5 text-sm"
          placeholder="ФИО *"
          required
          value={form.name}
          onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
        />
        <input
          className="input-dark rounded px-4 py-3.5 text-sm"
          placeholder="Город *"
          required
          value={form.city}
          onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
        />
        <input
          className="input-dark rounded px-4 py-3.5 text-sm"
          placeholder="Компания"
          value={form.company}
          onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
        />
        <input
          className="input-dark rounded px-4 py-3.5 text-sm"
          placeholder="Телефон *"
          required
          type="tel"
          value={form.phone}
          onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
        />
      </div>

      <label className="flex items-start gap-3 cursor-pointer group">
        <div
          onClick={() => setForm(p => ({ ...p, agree: !p.agree }))}
          className="w-5 h-5 rounded-sm shrink-0 mt-0.5 flex items-center justify-center transition-all"
          style={{
            background: form.agree ? 'rgba(201,169,110,0.9)' : 'transparent',
            border: `1px solid ${form.agree ? '#C9A96E' : 'rgba(201,169,110,0.3)'}`,
          }}
        >
          {form.agree && <Icon name="Check" size={12} className="text-obsidian" />}
        </div>
        <span className="text-white/40 text-xs leading-relaxed">
          Я соглашаюсь на обработку персональных данных в соответствии с Федеральным законом №152-ФЗ «О персональных данных»
        </span>
      </label>

      <button
        type="submit"
        disabled={loading || !form.agree}
        className="btn-gold rounded py-4 text-sm tracking-wider uppercase mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? 'Отправляем...' : 'Получить аудит'}
      </button>
    </form>
  );
}