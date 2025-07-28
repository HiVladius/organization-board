import { Fragment } from "react";
import type { ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-4xl'
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      {/* El componente Dialog ahora recibe 'open' y 'onClose' directamente */}
      <Dialog
        as="div"
        className="relative z-10"
        open={isOpen}
        onClose={onClose}
      >
        {/* El fondo oscuro (overlay) */}
        <Transition
          as={Fragment}
          show={isOpen}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition
              as={Fragment}
              show={isOpen}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0 scale-95"
            >
              {/* Ya no se usa Dialog.Panel, simplemente se renderiza un div con los estilos */}
              <div className={`w-full ${sizeClasses[size]} transform overflow-hidden rounded-2xl bg-slate-800 p-6 text-left align-middle shadow-xl transition-all`}>
                {/* Ya no se usa Dialog.Title, se usa un <h3> normal y se conecta con `aria-labelledby` para accesibilidad */}
                <h3 className="text-lg font-medium leading-6 text-white">
                  {title}
                </h3>

                <div className="mt-4">
                  {children}
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
