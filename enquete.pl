%-----------------------------------
% Types de crime
%-----------------------------------
crime_type(assassinat).
crime_type(escroquerie).
crime_type(vol).

%-----------------------------------
% Faits
%-----------------------------------
% Suspects
suspect(john).
suspect(mary).
suspect(alice).
suspect(bruno).
suspect(sophie).

% Mobiles
has_motive(john,vol).
has_motive(mary,assassinat).
has_motive(alice,escroquerie).

% Proximite scene de crime
was_near_crime_scene(john,vol).
was_near_crime_scene(mary,assassinat).

% Empreintes
has_fingerprint_on_weapon(john,vol).
has_fingerprint_on_weapon(mary,assassinat).

% Temoins
eyewitness_identification(john, assassinat).

% Transactions bancaires
has_bank_transaction(alice,escroquerie).
has_bank_transaction(bruno,escroquerie).

% Fausses identités
owns_fake_identity(sophie,escroquerie).

%-----------------------------------
% Regles de culpabilite
%-----------------------------------
is_guilty(Suspect,assassinat) :-
    has_motive(Suspect,assassinat),
    was_near_crime_scene(Suspect,assassinat),
    (has_fingerprint_on_weapon(Suspect,assassinat)
    ; eyewitness_identification(Suspect,assassinat)).

is_guilty(Suspect,vol) :-
    has_motive(Suspect,vol),
    was_near_crime_scene(Suspect,vol),
    (has_fingerprint_on_weapon(Suspect,vol)
    ; eyewitness_identification(Suspect,vol)).

is_guilty(Suspect, escroquerie) :-
    (owns_fake_identity(Suspect, escroquerie)
    ; (has_motive(Suspect, escroquerie), has_bank_transaction(Suspect, escroquerie))
    ; (has_motive(Suspect, escroquerie), owns_fake_identity(Suspect, escroquerie))
    ; (has_bank_transaction(Suspect, escroquerie), owns_fake_identity(Suspect, escroquerie))).

%-----------------------------------
% HTTP Web Server
%-----------------------------------
:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_json)).
:- use_module(library(http/http_header)).

% Endpoint REST pour vérifier la culpabilité
:- http_handler(root(check), check_crime, []).

check_crime(Request) :-
    format('Access-Control-Allow-Origin: *~n', []),
    format('Access-Control-Allow-Methods: POST, GET, OPTIONS~n', []),
    format('Access-Control-Allow-Headers: Content-Type~n', []),
    
    ( member(method(options), Request) -> 
        format('Content-type: text/plain~n~n', [])
    ;
        http_read_json_dict(Request, Dict),
         atom_string(Suspect, Dict.get(suspect)),
        atom_string(Crime, Dict.get(crime)),
        (is_guilty(Suspect, Crime) -> Result = "GUILTY" ; Result = "NOT GUILTY"),
        reply_json_dict(_{result: Result})
    ).

% Fonction pour récupérer la liste des suspects
suspect_list(List) :-
    findall(Name, suspect(Name), List).

% Fonction pour récupérer la liste des crimes
crime_list(List) :-
    findall(Type, crime_type(Type), List).

%-----------------------------------
% MAIN : lance le serveur web
%-----------------------------------
main_web :-
    format('Serveur Prolog lancé sur http://localhost:8080/~n'),
    http_server(http_dispatch, [port(8080)]).

%-----------------------------------
% STOP : arrête le serveur web          
%-----------------------------------
stop :-
    http_stop_server(8080, []). 


%---------------------------------------------
% MAIN CONSOLE : lance le projet sur console
%---------------------------------------------
main:-
    % current_input(Input),
    % read(Input,crime(Suspect,CrimeType)),
    % ( is_guilty(Suspect,CrimeType) ->
    %     writeln(guilty)
    %     ; writeln(not_guilty)
    % ),
    % halt.
    %VERSION AMELIOR2 POUR UX
    writeln('=== Enquête policière - Mode console ==='),
    writeln('Entrez le suspect et le type de crime au format : crime(suspect, crime).'),
    writeln('Exemple : crime(john, vol).'),
    writeln('Tapez end. pour quitter.'),
    repeat,
        write('> '),
        read(Input),
        ( Input == end ->
            writeln('Fin de l\'enquête.'),
            !
        ;
            ( Input = crime(Suspect, CrimeType) ->
                ( is_guilty(Suspect, CrimeType) ->
                    writeln('GUILTY')
                ;
                    writeln('NOT GUILTY')
                )
            ;
                writeln('Format invalide, réessayez.')
            ),
            fail
    ).