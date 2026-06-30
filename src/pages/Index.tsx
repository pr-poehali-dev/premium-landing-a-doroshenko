import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

const PHOTO_HERO = 'https://cdn.poehali.dev/projects/bb03cd52-a7e1-49a3-8dc8-9ec2c7948b7a/bucket/769d8997-96cd-415d-8802-959202bb8ee0.png';
const PHOTO_ABOUT_1 = 'https://cdn.poehali.dev/projects/bb03cd52-a7e1-49a3-8dc8-9ec2c7948b7a/bucket/9a18b6be-471b-434f-83ca-c4a47dd3ed78.png';
const PHOTO_ABOUT_2 = 'https://cdn.poehali.dev/projects/bb03cd52-a7e1-49a3-8dc8-9ec2c7948b7a/bucket/e3383e45-4b36-41f0-8304-8f1de0901248.png';

const WHO_ITEMS = [
  'Компания запуталась в долгах перед ФНС, банками или контрагентами',
  'Текущие продажи упали, а юнит-экономика летит в минус',
  'Собственник боится потерять личное имущество и попасть под субсидиарную ответственность',
  'Руководитель устал от юристов, которые мыслят параграфами, а не реальной экономикой бизнеса',
];

const STEPS = [
  {
    icon: 'MessageSquare',
    title: 'Экспертная консультация',
    text: 'Первичный глубокий разбор вашей ситуации и экспресс-оценка рисков.',
  },
  {
    icon: 'FileSearch',
    title: 'Предбанкротный аудит',
    text: 'Анализ договоров, выписок и цепочек сделок за 3 года (до 50 штук).',
  },
  {
    icon: 'ShieldCheck',
    title: 'Закрытие уязвимостей',
    text: 'Поиск и устранение экономических рисков до принятия заявления судом.',
  },
  {
    icon: 'BarChart2',
    title: 'Анализ модели',
    text: 'Проверка бизнеса на жизнеспособность. Если систему можно спасти через перестройку маркетинга и ОП — мы её спасаем.',
  },
  {
    icon: 'Scale',
    title: 'Контролируемая процедура',
    text: 'Если спасать поздно — запуск официальной процедуры банкротства в надежном СРО.',
  },
  {
    icon: 'Lock',
    title: 'Защита активов',
    text: 'Полное b2b-сопровождение и защита личного имущества директора на всех этапах дела.',
  },
];

const PRICES = [
  {
    title: 'Экспертная b2b-консультация',
    duration: '1 час',
    price: '10 000 ₽',
    description: 'Прямой разбор вашей ситуации, оценка рисков субсидиарки и ФНС, определение стратегии. Никакой воды и «бесплатных» зазываний.',
  },
  {
    title: 'Предбанкротный аудит для ИП',
    duration: 'до 50 договоров',
    price: '30 000 ₽',
    description: 'Полный анализ договоров, банковских выписок и сделок за последние 3 года. Выявление уязвимостей до начала судебного процесса.',
  },
  {
    title: 'Предбанкротный аудит для ООО',
    duration: 'до 50 договоров',
    price: '50 000 ₽',
    description: 'Глубокий аудит документации, цепочек сделок и баланса за 3 года. Проверка на риски преднамеренности и субсидиарной ответственности.',
  },
];

const CITIES = ['Владимир', 'Москва', 'Нижний Новгород', 'Иваново', 'Рязань', 'Ярославль'];

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

function Modal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', phone: '', city: '', company: '', message: '' });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full max-w-md"
        style={{ background: '#0e0e0e', border: '1px solid rgba(201,169,110,0.35)', borderRadius: 2 }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">
          <Icon name="X" size={20} />
        </button>
        {sent ? (
          <div className="p-10 text-center">
            <div className="text-5xl mb-4">✓</div>
            <p className="font-cormorant text-2xl gold-text mb-2">Заявка принята</p>
            <p className="text-white/60 font-golos text-sm">Андрей свяжется с вами лично в ближайшее время</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-4">
            <h3 className="font-cormorant text-2xl text-off-white mb-1">Записаться на консультацию</h3>
            <p className="text-white/50 text-sm font-golos mb-2">Андрей лично свяжется с вами и согласует время</p>
            <input className="input-dark rounded px-4 py-3 text-sm w-full" placeholder="ФИО *" required
              value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            <input className="input-dark rounded px-4 py-3 text-sm w-full" placeholder="Телефон *" required type="tel"
              value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            <input className="input-dark rounded px-4 py-3 text-sm w-full" placeholder="Город"
              value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
            <input className="input-dark rounded px-4 py-3 text-sm w-full" placeholder="Компания (ООО/ИП)"
              value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
            <textarea className="input-dark rounded px-4 py-3 text-sm w-full resize-none" rows={3}
              placeholder="Кратко опишите вашу ситуацию"
              value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
            <button type="submit" disabled={loading} className="btn-gold rounded py-3 text-sm mt-2 disabled:opacity-60">
              {loading ? 'Отправляем...' : 'Записаться на консультацию'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function Index() {
  const [modalOpen, setModalOpen] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);

  const hero = useInView(0.05);
  const who = useInView(0.1);
  const problem = useInView(0.1);
  const method = useInView(0.1);
  const prices = useInView(0.1);
  const social = useInView(0.1);
  const about = useInView(0.1);
  const contact = useInView(0.1);

  useEffect(() => {
    const interval = setInterval(() => setPhotoIdx(i => (i + 1) % 2), 5000);
    return () => clearInterval(interval);
  }, []);

  const aboutPhotos = [PHOTO_ABOUT_1, PHOTO_ABOUT_2];

  return (
    <div className="min-h-screen bg-obsidian text-off-white font-golos overflow-x-hidden">
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 py-4"
        style={{ background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(201,169,110,0.1)' }}>
        <div className="font-cormorant text-lg tracking-widest uppercase gold-text">А. Дорошенко</div>
        <nav className="hidden md:flex gap-8 text-xs text-white/40 tracking-widest uppercase">
          <a href="#method" className="hover:text-white transition-colors">Методология</a>
          <a href="#prices" className="hover:text-white transition-colors">Стоимость</a>
          <a href="#about" className="hover:text-white transition-colors">Обо мне</a>
          <a href="#contact" className="hover:text-white transition-colors">Контакт</a>
        </nav>
        <button onClick={() => setModalOpen(true)}
          className="text-xs tracking-widest uppercase gold-text hover:opacity-70 transition-opacity border border-gold/30 px-4 py-2 hidden md:block">
          Консультация
        </button>
        <a href="tel:89206200034" className="text-sm gold-text hover:opacity-80 transition-opacity font-medium md:hidden">
          8 920 620-00-34
        </a>
      </header>

      {/* БЛОК 1 — HERO */}
      <section ref={hero.ref} className="relative min-h-screen flex items-stretch overflow-hidden pt-16">
        {/* Left: text */}
        <div className="relative z-10 flex flex-col justify-center px-6 md:px-16 lg:px-24 py-20 w-full md:w-1/2">
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(rgba(201,169,110,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.025) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
          <div className="relative z-10 max-w-xl">
            <p className={`text-xs tracking-[0.35em] uppercase text-gold/70 mb-8 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '0.1s' }}>
              Арбитражный управляющий · b2b-консультант
            </p>

            <h1 className={`font-cormorant font-light leading-[1.08] mb-8 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ fontSize: 'clamp(2rem, 4.5vw, 4rem)', transitionDelay: '0.2s' }}>
              Антикризисное управление,<br />
              системный аудит<br />
              <span className="gold-gradient">и арбитраж для ООО и ИП</span>
            </h1>

            <div className={`mb-10 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '0.35s' }}>
              <div className="pl-5 border-l border-gold/40 mb-6">
                <p className="text-white/65 text-[15px] md:text-base leading-relaxed italic font-light">
                  «Я знаю, через что вы проходите, потому что сам прошел процедуру банкротства как директор и собственник бизнеса. Я не просто ликвидатор по бумажкам — я антикризисный архитектор».
                </p>
              </div>
            </div>

            <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '0.5s' }}>
              <button onClick={() => setModalOpen(true)} className="btn-gold px-8 py-4 text-sm tracking-wider uppercase rounded-sm">
                Записаться на консультацию
              </button>
              <a href="#prices" className="flex items-center justify-center gap-2 px-6 py-4 text-sm tracking-wide text-white/50 hover:text-white transition-colors border border-white/10 rounded-sm hover:border-white/20">
                Посмотреть цены
                <Icon name="ArrowDown" size={15} />
              </a>
            </div>
          </div>
        </div>

        {/* Right: photo */}
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-1/2">
          <div className="absolute inset-0 z-10" style={{
            background: 'linear-gradient(to right, #0A0A0A 0%, transparent 35%)'
          }} />
          <img src={PHOTO_HERO} alt="Андрей Дорошенко"
            className="w-full h-full object-cover object-top"
            style={{ filter: 'brightness(0.85) contrast(1.05)' }} />
          <div className="absolute inset-0 z-10" style={{
            background: 'linear-gradient(to top, #0A0A0A 0%, transparent 40%)'
          }} />
        </div>

        <div className="absolute bottom-8 left-6 md:left-16 flex flex-col items-start gap-2 z-10">
          <div className="w-px h-14 bg-gradient-to-b from-transparent to-gold/30" />
        </div>
      </section>

      {/* БЛОК 2 — КОМУ ПОДХОДИТ */}
      <section ref={who.ref} className="py-24 px-6 md:px-16 lg:px-24"
        style={{ borderTop: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(180deg, #0A0A0A 0%, #111 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <div className={`mb-14 transition-all duration-700 ${who.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Ко мне обращаются</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Обычно ко мне обращаются, когда
            </h2>
            <div className="section-divider mt-6" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {WHO_ITEMS.map((item, i) => (
              <div key={i}
                className={`flex items-start gap-4 p-6 rounded-sm transition-all duration-700 ${who.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.12)', transitionDelay: `${0.1 + i * 0.1}s` }}>
                <Icon name="Check" size={16} className="text-gold shrink-0 mt-0.5" />
                <p className="text-white/75 text-[15px] leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* БЛОК 3 — ПРОБЛЕМА */}
      <section ref={problem.ref} className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <div className={`mb-14 transition-all duration-700 ${problem.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Рыночные мифы</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Почему ликвидация «за 15 000 ₽»<br />— это ловушка
            </h2>
            <div className="section-divider mt-6" />
          </div>
          <div className={`space-y-5 transition-all duration-700 ${problem.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: '0.15s' }}>
            <div className="p-7 rounded-sm"
              style={{ background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.15)' }}>
              <p className="text-white/75 text-[15px] leading-relaxed">
                Большинство компаний идут к юристам слишком поздно или используют серые схемы со сменой директоров на номиналов. Налоговая служба щелкает такие схемы за секунду.
              </p>
            </div>
            <div className="p-7 rounded-sm"
              style={{ background: 'rgba(201,169,110,0.07)', border: '1px solid rgba(201,169,110,0.25)' }}>
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-sm flex items-center justify-center"
                  style={{ background: 'rgba(201,169,110,0.15)', border: '1px solid rgba(201,169,110,0.3)' }}>
                  <Icon name="AlertTriangle" size={18} className="text-gold" />
                </div>
                <p className="text-white/85 text-[15px] leading-relaxed">
                  До подачи любого заявления в суд критически важно провести жесткий экономический аудит всех сделок за последние <span className="text-gold font-medium">3 года</span> по методологии скоринга ФНС.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* БЛОК 4 — МЕТОДОЛОГИЯ */}
      <section id="method" ref={method.ref} className="py-24 px-6 md:px-16 lg:px-24"
        style={{ borderTop: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(180deg, #0A0A0A 0%, #111 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className={`mb-16 transition-all duration-700 ${method.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Методология</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Сначала аудит сделок и юнит-экономика —{' '}
              <span className="gold-gradient">потом суд</span>
            </h2>
            <div className="section-divider mt-6" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {STEPS.map((step, i) => (
              <div key={i}
                className={`p-7 rounded-sm transition-all duration-700 ${method.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ background: 'rgba(201,169,110,0.03)', border: '1px solid rgba(201,169,110,0.1)', transitionDelay: `${0.1 + i * 0.08}s` }}>
                <div className="w-10 h-10 rounded-sm flex items-center justify-center mb-5"
                  style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.2)' }}>
                  <Icon name={step.icon} fallback="Star" size={18} className="text-gold" />
                </div>
                <p className="text-off-white font-medium text-sm mb-2">{step.title}</p>
                <p className="text-white/50 text-sm leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* БЛОК 5 — СТОИМОСТЬ */}
      <section id="prices" ref={prices.ref} className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <div className={`mb-16 transition-all duration-700 ${prices.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Инвестиции</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Фиксированные чеки.<br />Никакой воды.
            </h2>
            <div className="section-divider mt-6" />
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {PRICES.map((item, i) => (
              <div key={i}
                className={`p-8 rounded-sm flex flex-col transition-all duration-700 ${prices.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{
                  background: i === 0 ? 'rgba(201,169,110,0.06)' : 'rgba(201,169,110,0.03)',
                  border: i === 0 ? '1px solid rgba(201,169,110,0.3)' : '1px solid rgba(201,169,110,0.1)',
                  transitionDelay: `${0.1 + i * 0.12}s`
                }}>
                <p className="text-xs tracking-widest uppercase text-white/30 mb-4">{item.duration}</p>
                <p className="text-off-white font-medium text-[15px] mb-4 leading-snug">{item.title}</p>
                <p className="font-cormorant text-4xl gold-text font-semibold mb-5">{item.price}</p>
                <p className="text-white/50 text-sm leading-relaxed flex-1">{item.description}</p>
                <button onClick={() => setModalOpen(true)}
                  className="mt-6 text-xs tracking-widest uppercase gold-text hover:opacity-70 transition-opacity flex items-center gap-2">
                  Записаться <Icon name="ArrowRight" size={13} />
                </button>
              </div>
            ))}
          </div>
          <div className={`p-6 rounded-sm transition-all duration-700 ${prices.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', transitionDelay: '0.45s' }}>
            <div className="flex items-start gap-4">
              <Icon name="Info" size={16} className="text-white/30 shrink-0 mt-0.5" />
              <p className="text-white/40 text-sm leading-relaxed">
                <span className="text-white/60">Внимание:</span> В месяц я беру в личное сопровождение строго не более 3 компаний. Если вы ищете «чёрные» схемы или хотите скрыть криминал — не тратьте мои 10 000 рублей, нам не по пути.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* БЛОК 6 — СОЦИАЛЬНЫЙ */}
      <section ref={social.ref} className="py-20 px-6 md:px-16 lg:px-24"
        style={{ borderTop: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(180deg, #0A0A0A 0%, #111 100%)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className={`transition-all duration-700 ${social.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Бесплатно</p>
            <h2 className="font-cormorant text-3xl md:text-4xl text-off-white font-light mb-6">
              Не готовы к платной консультации?<br />Читайте мои b2b-разборы бесплатно
            </h2>
            <p className="text-white/50 text-[15px] leading-relaxed mb-10 max-w-2xl mx-auto">
              В своих каналах я без купюр и юридической воды разбираю реальные кейсы: как налоговая находит скрытые связи, почему летят отделы продаж и как ИИ помогает спасать юнит-экономику до того, как компании врубят субсидиарку.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://t.me/adprodmarketing" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 px-7 py-4 rounded-sm hover:opacity-80 transition-opacity"
                style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.25)' }}>
                <Icon name="Send" size={16} className="text-gold" />
                <span className="text-off-white text-sm">Андрей Дорошенко | Антикризисные разборы</span>
                <Icon name="ArrowUpRight" size={14} className="text-gold/50" />
              </a>
              <a href="https://vk.com/a.doroshenko87" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 px-7 py-4 rounded-sm hover:opacity-80 transition-opacity"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Icon name="Users" size={16} className="text-white/50" />
                <span className="text-white/60 text-sm">ВКонтакте</span>
                <Icon name="ArrowUpRight" size={14} className="text-white/30" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* БЛОК 7 — ОБО МНЕ */}
      <section id="about" ref={about.ref} className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
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
                <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-sm"
                  style={{ border: '1px solid rgba(201,169,110,0.15)', zIndex: -1 }} />
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
              <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Обо мне</p>
              <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
                Андрей<br />Дорошенко
              </h2>
              <div className="w-12 h-px bg-gold mb-8 mt-6" />
              <div className="space-y-5 text-white/65 leading-relaxed text-[15px]">
                <p>Дипломированный арбитражный управляющий, b2b-маркетолог и специалист по формированию отделов продаж.</p>
                <p>Сам прошел процедуру банкротства в качестве директора и собственника, поэтому знаю изнанку процесса не по учебникам.</p>
                <p>Специализируюсь на оцифровке бизнес-процессов, работе с ИИ-базами данных и перестройке юнит-экономики продуктов.</p>
                <p>Моя задача — зайти на предприятие как бизнес-аудитор, защитить личные активы владельца и выстроить безопасную b2b-стратегию.</p>
              </div>
              <button onClick={() => setModalOpen(true)}
                className="mt-10 flex items-center gap-3 text-sm tracking-wider uppercase gold-text hover:opacity-70 transition-opacity">
                <span>Записаться на консультацию</span>
                <Icon name="ArrowRight" size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* БЛОК 8 — КОНТАКТЫ */}
      <section id="contact" ref={contact.ref} className="py-24 px-6 md:px-16 lg:px-24"
        style={{ borderTop: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(180deg, #0A0A0A 0%, #111 100%)' }}>
        <div className="max-w-3xl mx-auto">
          <div className={`text-center mb-14 transition-all duration-700 ${contact.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Связаться</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Записаться на платную<br />b2b-консультацию
            </h2>
            <div className="section-divider mt-6" />
          </div>

          <div className={`grid md:grid-cols-2 gap-8 mb-12 transition-all duration-700 ${contact.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: '0.15s' }}>
            <div>
              <p className="text-xs tracking-widest uppercase text-white/30 mb-5">Контакты</p>
              <div className="space-y-4">
                <a href="tel:89206200034" className="flex items-center gap-3 gold-text hover:opacity-70 transition-opacity">
                  <Icon name="Phone" size={15} className="text-gold/60" />
                  <span className="font-cormorant text-xl">8 920 620-00-34</span>
                </a>
                <a href="mailto:and-doroshe@mail.ru" className="flex items-center gap-3 text-white/50 hover:text-white transition-colors">
                  <Icon name="Mail" size={15} className="text-white/30" />
                  <span className="text-sm">and-doroshe@mail.ru</span>
                </a>
                <a href="https://t.me/adprodmarketing" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/50 hover:text-gold transition-colors">
                  <Icon name="Send" size={15} className="text-white/30" />
                  <span className="text-sm">@adprodmarketing</span>
                </a>
              </div>
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-white/30 mb-5">География работы</p>
              <div className="flex flex-wrap gap-2">
                {CITIES.map((city, i) => (
                  <span key={i} className="text-xs px-3 py-1.5 rounded-sm text-white/50"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={`transition-all duration-700 ${contact.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: '0.3s' }}>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(201,169,110,0.1)', background: '#060606' }} className="py-8 px-6 md:px-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="font-cormorant text-lg gold-text">Дорошенко Андрей Анатольевич</p>
            <p className="text-white/25 text-xs mt-1">Арбитражный управляющий · Антикризисный консультант</p>
          </div>
          <div className="flex gap-4">
            <a href="https://t.me/adprodmarketing" target="_blank" rel="noopener noreferrer"
              className="text-white/25 hover:text-gold transition-colors">
              <Icon name="Send" size={16} />
            </a>
            <a href="https://vk.com/a.doroshenko87" target="_blank" rel="noopener noreferrer"
              className="text-white/25 hover:text-white transition-colors">
              <Icon name="Users" size={16} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', phone: '', city: '', company: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('https://functions.poehali.dev/fc323d06-bbf9-4e34-b478-9a1d63552d0d', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: 'bottom' }),
      });
      if (res.ok) setSent(true);
    } catch {
      setSent(true);
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="text-center py-10">
        <div className="text-4xl mb-4">✓</div>
        <p className="font-cormorant text-2xl gold-text mb-2">Заявка принята</p>
        <p className="text-white/50 text-sm">Андрей свяжется с вами лично в ближайшее время</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
      <input className="input-dark rounded-sm px-4 py-3 text-sm" placeholder="ФИО *" required
        value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
      <input className="input-dark rounded-sm px-4 py-3 text-sm" placeholder="Телефон *" required type="tel"
        value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
      <input className="input-dark rounded-sm px-4 py-3 text-sm" placeholder="Город"
        value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
      <input className="input-dark rounded-sm px-4 py-3 text-sm" placeholder="Компания (ООО/ИП)"
        value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
      <textarea className="input-dark rounded-sm px-4 py-3 text-sm resize-none md:col-span-2" rows={3}
        placeholder="Кратко опишите вашу ситуацию"
        value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
      <div className="md:col-span-2">
        <button type="submit" disabled={loading}
          className="btn-gold rounded-sm py-4 px-12 text-sm tracking-wider uppercase disabled:opacity-60">
          {loading ? 'Отправляем...' : 'Записаться на консультацию'}
        </button>
      </div>
    </form>
  );
}
