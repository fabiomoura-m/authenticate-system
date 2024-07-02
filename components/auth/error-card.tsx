import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import CardWrapper from '@/components/auth/card-wrapper';

const ErrorCard = () => {
    return (
        <CardWrapper
            headerLabel="Oops! Algo deu errado!"
            backButtonHref="/auth/login"
            backButtonLabel="Voltar ao login"
        >
            <div className='w-full flex justify-center items-center'>
                <ExclamationTriangleIcon className='text-destructive' />
            </div>
        </CardWrapper>
    );
};

export default ErrorCard;
